module.exports = {
  friendlyName: "Login",

  description: "Connexion utilisant le mot de passe et email soumis.",

  extendedDescription: `Cette action essaye de trouver l'utilosateur dans la BDD, puis utilise Bcrypt pour comparer le mot de passe 
  de l'user haché dans la BDD et le mot de passe soumit, que l'on hache pour l'occasion.`,

  inputs: {
    emailAddress: {
      description: 'Email soumit "irl@example.com".',
      type: "string",
      required: true
    },

    password: {
      description: "Mot de passe soumit",
      type: "string",
      required: true
    },

    rememberMe: {
      description: "Étendre ou non la durée de vie de la session",
      extendedDescription: `N'est pas supporté par les requêtes virtuelles (ex: WebSockets plutôt qu'HTTP).`,
      type: "boolean"
    }
  },

  exits: {
    success: {
      description: "L'agent requis a été connecté avec succès.",
      extendedDescription: `Implicitement, cette fonction enregistre l'id de l'utilisateur connecté dans la session en tant que
\`userId\`.  La prochaine fois que l'user envoie une requête incluant un cookie, Sails rendra automatiquement cet utilisateur disponible en tant que
 req.session.userId dans l'action correspondante.  (Aussi, grâce au hook "custom" inclut dans le code, quand une requête pertinente est reçue d'un user, 
 l'entrée complète correspondant à cet user sera disponible sous \`req.me\`.)`
    },

    badCombo: {
      description: `Le couple email / password ne correspond à aucun utilisateur dans la BDD.`,
      responseType: "unauthorized"
      // ^This uses the custom `unauthorized` response located in `api/responses/unauthorized.js`.
      // To customize the generic "unauthorized" response across this entire app, change that file
      // (see api/responses/unauthorized).
      //
      // To customize the response for _only this_ action, replace `responseType` with
      // something else.  For example, you might set `statusCode: 498` and change the
      // implementation below accordingly (see http://sailsjs.com/docs/concepts/controllers).
    }
  },

  fn: async function(inputs, exits) {
    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await User.findOne({
      emailAddress: inputs.emailAddress.toLowerCase()
    });

    // Si l'on ne trouve aucun user, on appelle badCombo
    if (!userRecord) {
      throw "badCombo";
    }

    // Si le mot de passe ne correspond pas, on renvoie également vers badCombo
    await sails.helpers.passwords
      .checkPassword(inputs.password, userRecord.password)
      .intercept("incorrect", "badCombo");

    // If "Remember Me" was enabled, then keep the session alive for
    // a longer amount of time.  (This causes an updated "Set Cookie"
    // response header to be sent as the result of this request -- thus
    // we must be dealing with a traditional HTTP request in order for
    // this to work.)
    if (inputs.rememberMe) {
      if (this.req.isSocket) {
        sails.log.warn(
          "Reçu `rememberMe: true` d'une requête virtuelle, mais l'instruction est ignorée,\n" +
            "car les cookies session d'un utilisateur ne peuvent être remis à zéro par socket.\n" +
            "Utilisez plutôt une requête http traditionnelle."
        );
      } else {
        this.req.session.cookie.maxAge =
          sails.config.custom.rememberMeCookieMaxAge;
      }
    }

    // Modify the active session instance.
    this.req.session.userId = userRecord.id;

    // Send success response (this is where the session actually gets persisted)
    return exits.success();
  }
};
