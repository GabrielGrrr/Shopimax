module.exports = {
  friendlyName: "Send password recovery email",

  description:
    "Envoie une notification de récupération de mot de passe avec l'adresse mail fournie.",

  inputs: {
    emailAddress: {
      description:
        "L'adresse mail de l'user prétendu voulant récupérer son mot de passe.",
      example: "rydahl@example.com",
      type: "string",
      required: true
    }
  },

  exits: {
    success: {
      description:
        "L'adresse email peut avoir correspondu à un user dans la BDD.  (Si c'est le cas, un mail de récupération a été envoyé.)"
    }
  },

  fn: async function(inputs, exits) {
    // Trouve l'entrée correspondant à cet user
    // (Même si l'user n'existe pas, prétendre que cela a fonctionné pour décourager du sniffing).
    var userRecord = await User.findOne({ emailAddress: inputs.emailAddress });
    if (!userRecord) {
      return exits.success();
    } //•

    // Trouver un token pseudo-rando et probablement unique pour l'utiliser
    // dans notre mail de récup.
    var token = await sails.helpers.strings.random("url-friendly");

    // Enregistre le token dans l'entrée user
    // (Ce qui permet de consulter l'user quand le token envoyé par mail est cliqué.)
    await User.update({ id: userRecord.id }).set({
      passwordResetToken: token,
      passwordResetTokenExpiresAt:
        Date.now() + sails.config.custom.passwordResetTokenTTL
    });

    // Envoie le mail de récup.
    await sails.helpers.sendTemplateEmail.with({
      to: inputs.emailAddress,
      subject: "Password reset instructions",
      template: "email-reset-password",
      templateData: {
        fullName: userRecord.fullName,
        token: token
      }
    });

    return exits.success();
  }
};
