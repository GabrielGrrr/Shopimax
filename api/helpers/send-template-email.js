module.exports = {
  friendlyName: "Send template email",

  description: "Envoie un email en utilisant un template.",

  extendedDescription: `Pour faciliter la phase de test en mode dev, si si l'email adresse fournie se termine par "@example.com",
alors le message sera inscrit sur le terminal plutôt qu'envoyé par mail.
(Thanks [@simonratner](https://github.com/simonratner)!)`,

  inputs: {
    template: {
      description:
        "Le chemin relatif vers un template EJS à l'intérieur de notre dossier views/emails/ -- SANS l'extension du fichier.",
      extendedDescription: `Utilisez des chaînes type "foo" ou "foo/bar", mais JAMAIS "foo/bar.ejs".  Par exemple, "marketing/welcome" enverrait un email
utilisant le template "views/emails/marketing/welcome.ejs".`,
      example: "reset-password",
      type: "string",
      required: true
    },

    templateData: {
      description:
        "Un dictionnaire de données accessible dans le template EJS.",
      extendedDescription: `Chaque clé sera une variable locale accessible dans le template. Par exemple, si vous fournissez
un dictionnaire avec une clé \`friends\`, et \`friends\` est un tableau tel \`[{name:"Chandra"}, {name:"Mary"}]\`),
alors vous serez à-même d'accéder à \`friends\` depuis le template:
\`\`\`
<ul><% for (friend of friends){ %>
  <li><%= friend.name %></li><% }); %></ul>
\`\`\`

C'est de l'EJS, donc utilisez \`<%= %>\` pour injecter du contenu html échappé,
\`<%- %>\` pour court-circuiter l'échappement et injecter du brut, ou \`<% %>\` pour exécuter du
code Javascript tel qu'un embranchement conditionnel \`if\` ou une boucle \`for\`.`,
      type: {},
      defaultsTo: {}
    },

    to: {
      description: "L'adresse e-mail du destinataire.",
      extendedDescription: `Si cette adresse se termine par "@example.com", le message est simplement affiché dans la console.`,
      example: "foo@bar.com",
      required: true
    },

    subject: {
      description: "Le sujet du mail.",
      example: "Hello there.",
      defaultsTo: ""
    },

    layout: {
      description:
        "Mettre à `false` pour désactiver l'utilisation d'un layout/pattern, ou fournir le chemin (relatif " +
        "depuis `views/layouts/`) vers un layout/pattern email de surcharge.",
      defaultsTo: "layout-email",
      custom: layout => layout === false || _.isString(layout)
    }
  },

  exits: {
    success: {
      outputFriendlyName: "Email delivery report",
      outputDescription:
        "Un dictionnaire d'information a propos de ce qu'il sest déroulé.",
      outputType: {
        loggedInsteadOfSending: "boolean"
      }
    }
  },

  fn: async function(inputs, exits) {
    var path = require("path");
    var url = require("url");
    var util = require("util");

    if (!_.startsWith(path.basename(inputs.template), "email-")) {
      sails.log.warn(
        'Le "template" passé en argument à `sendTemplateEmail()` ne commence pas par ' +
          '"email-" -- mais par convention, tous les templates d\'email dans `views/emails/` devraient ' +
          "être définis ainsi.  (Cela rend leur consultation plus facile quand on les trie par " +
          "filename; ex: en utilisant CMD/CTRL+P avec Sublime Text.)\n" +
          "Quoi qu'il en soit, continuons ..."
      );
    }

    if (
      _.startsWith(inputs.template, "views/") ||
      _.startsWith(inputs.template, "emails/")
    ) {
      throw new Error(
        'Le "template" passé en argument à `sendTemplateEmail()` a été préfixé par\n' +
          "`emails/` ou `views/` -- mais cette partie est supposée être omise.  Préférez, s'il vous plaît,\n" +
          "spécifier le chemin relatif vers le template d'email désiré depuis `views/emails/`.\n" +
          "Par exemple:\n" +
          "  template: 'email-reset-password'\n" +
          "Ou:\n" +
          "  template: 'admin/email-contact-form'\n" +
          " [?] If you're unsure or need advice, see https://sailsjs.com/support"
      );
    } //•

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join("emails/", inputs.template);
    var layout;
    if (inputs.layout) {
      layout = path.relative(
        path.dirname(emailTemplatePath),
        path.resolve("layouts/", inputs.layout)
      );
    } else {
      layout = false;
    }

    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.), and also provide access to core
    // > `util` package (for dumping debug data in internal emails).
    var htmlEmailContents = await sails
      .renderView(
        emailTemplatePath,
        Object.assign({ layout, url, util }, inputs.templateData)
      )
      .intercept(err => {
        err.message =
          "Could not compile view template.\n" +
          "(Usually, this means the provided data is invalid, or missing a piece.)\n" +
          "Details:\n" +
          err.message;
        return err;
      });

    // Sometimes only log info to the console about the email that WOULD have been sent.
    // Specifically, if the "To" email address is anything "@example.com".
    //
    // > This is used below when determining whether to actually send the email,
    // > for convenience during development, but also for safety.  (For example,
    // > a special-cased version of "user@example.com" is used by Trend Micro Mars
    // > scanner to "check apks for malware".)
    var isToAddressConsideredFake = Boolean(inputs.to.match(/@example\.com$/i));

    // If that's the case, or if we're in the "test" environment, then log
    // the email instead of sending it:
    if (sails.config.environment === "test" || isToAddressConsideredFake) {
      sails.log(
        `Skipped sending email, either because the "To" email address ended in "@example.com"
or because the current \`sails.config.environment\` is set to "test".

But anyway, here is what WOULD have been sent:
-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-
To: ${inputs.to}
Subject: ${inputs.subject}

Body:
${htmlEmailContents}
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-`
      );
    } else {
      // Otherwise, we'll check that all required Mailgun credentials are set up
      // and, if so, continue to actually send the email.

      if (
        !sails.config.custom.mailgunSecret ||
        !sails.config.custom.mailgunDomain
      ) {
        throw new Error(
          `Cannot deliver email to "${inputs.to}" because:
        ` +
            (() => {
              let problems = [];
              if (!sails.config.custom.mailgunSecret) {
                problems.push(
                  " • Mailgun secret is missing from this app's configuration (`sails.config.custom.mailgunSecret`)"
                );
              }
              if (!sails.config.custom.mailgunDomain) {
                problems.push(
                  " • Mailgun domain is missing from this app's configuration (`sails.config.custom.mailgunDomain`)"
                );
              }
              return problems.join("\n");
            })() +
            `

To resolve these configuration issues, add the missing config variables to
\`config/custom.js\`-- or in staging/production, set them up as system
environment vars.  (If you don\'t have a Mailgun domain or secret, you can
sign up for free at https://mailgun.com to receive sandbox credentials.)

> Note that, for convenience during development, there is another alternative:
> In lieu of setting up real Mailgun credentials, you can "fake" email
> delivery by using any email address that ends in "@example.com".  This will
> write automated emails to your logs rather than actually sending them.
> (To simulate clicking on a link from an email, just copy and paste the link
> from the terminal output into your browser.)

 [?] If you're unsure, visit https://sailsjs.com/support`
        );
      }

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        to: inputs.to,
        subject: inputs.subject,
        testMode: false
      });
    } //ﬁ

    // All done!
    return exits.success({
      loggedInsteadOfSending: isToAddressConsideredFake
    });
  }
};
