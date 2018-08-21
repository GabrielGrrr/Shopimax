module.exports = {
  friendlyName: "View account overview",

  description: "Affiche l page / tableau de bord profil",

  exits: {
    success: {
      viewTemplatePath: "pages/account/account-overview"
    }
  },

  fn: async function(inputs, exits) {
    // Si la fonctionnalité de paiement a été activée, inclut la clé de
    // Stripe.js configurée dans sails.config.custom.stripePublishableKey.  Sinon, on la laisse à undefined.
    return exits.success({
      stripePublishableKey: sails.config.custom.enableBillingFeatures
        ? sails.config.custom.stripePublishableKey
        : undefined
    });
  }
};
