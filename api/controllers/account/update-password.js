module.exports = {
  friendlyName: "Met à jour le mot de passe",

  description: "Met à jour le mot de passe pour l'utilisateur connecté.",

  inputs: {
    password: {
      description: "Le nouveau mot de passe non-encodé.",
      example: "abc123v2",
      required: true
    }
  },

  fn: async function(inputs, exits) {
    // Hache le mot de passe.
    var hashed = await sails.helpers.passwords.hashPassword(inputs.password);

    // Met à jour l'entrée concernant l'user connecté.
    await User.update({ id: this.req.me.id }).set({
      password: hashed
    });

    return exits.success();
  }
};
