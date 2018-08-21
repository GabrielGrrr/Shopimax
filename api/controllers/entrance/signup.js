module.exports = {
  friendlyName: "Signup",

  description: "Enregistre un nouveau compte utilisateur.",

  extendedDescription: `Cela crée une nouvelle entrée user dans la BDD, logge l'user envoyant la requête en modififant sa
[session](https://sailsjs.com/documentation/concepts/sessions), 
et envoie un mail de vérification (si mailgun a été activé).

Si un mail de vérification est envoyé, le compte du nouvel user est mis dans un état
"unconfirmed" jusqu'à ce qu'ils puissent confirmer l'utilisation d'une adresse mail légitime
(en cliquant sur le lien dans le mail de vérification).`,

  inputs: {
    emailAddress: {
      required: true,
      type: "string",
      isEmail: true,
      description:
        "L'adresse e-mail pour le nouveau compte, ex: m@example.com.",
      extendedDescription: "Doit être une adresse email valide."
    },

    password: {
      required: true,
      type: "string",
      maxLength: 200,
      example: "passwordlol",
      description: "Le mot de passe encodé à utiliser pour le nouveau compte."
    },

    fullName: {
      required: true,
      type: "string",
      example: "Frida Kahlo de Rivera",
      description: "Le nom d'utilisateur complet."
    }
  },

  exits: {
    invalid: {
      responseType: "badRequest",
      description:
        "Le nom d'utilisateur, password ou email fourni n'est pas valide.",
      extendedDescription:
        "Si cette requête a été envoyée par une GUI, les valeurs fournies en paramètre" +
        "auraient dû être validées avant d'avoir été envoyées."
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: "L'adresse email fournie est déjà utilisée."
    }
  },

  fn: async function(inputs, exits) {
    var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Construit les données pour le nouvel utilisateur et les enregistre dans le SGBD
    // (Aussi, utilise `fetch` pour récupérer le nouvel ID afin que l'on puisse l'utiliser ci-dessous.)
    var newUserRecord = await User.create(
      Object.assign(
        {
          emailAddress: newEmailAddress,
          password: await sails.helpers.passwords.hashPassword(inputs.password),
          fullName: inputs.fullName,
          tosAcceptedByIp: this.req.ip
        },
        sails.config.custom.verifyEmailAddresses
          ? {
              emailProofToken: await sails.helpers.strings.random(
                "url-friendly"
              ),
              emailProofTokenExpiresAt:
                Date.now() + sails.config.custom.emailProofTokenTTL,
              emailStatus: "unconfirmed"
            }
          : {}
      )
    )
      .intercept("E_UNIQUE", "emailAlreadyInUse")
      .intercept({ name: "UsageError" }, "invalid")
      .fetch();

    // Si les fonctionnalités de paiement sont activées, enregistre une nouvelle entrée client dans l'API Stripe.
    // Puis persiste l'id client Stripe dans la SGBD.
    if (sails.config.custom.enableBillingFeatures) {
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        emailAddress: newEmailAddress
      });
      await User.update(newUserRecord.id).set({
        stripeCustomerId
      });
    }

    // Enregistre l'id user dans sa session
    this.req.session.userId = newUserRecord.id;

    if (sails.config.custom.verifyEmailAddresses) {
      // Envoie le mail de confirmation
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: "Confirmez votre compte",
        template: "email-verify-account",
        templateData: {
          fullName: inputs.fullName,
          token: newUserRecord.emailProofToken
        }
      });
    } else {
      sails.log.info(
        "On évite la vérification du compte par email... (puisque `verifyEmailAddresses` est désactivé)"
      );
    }

    // Puisque tout s'est bien passé, envoie notre réponse 200
    return exits.success();
  }
};
