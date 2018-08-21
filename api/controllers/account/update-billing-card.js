module.exports = {
  friendlyName: "Met à jour la carte de paiement",

  description: "Met à jour la carte de paiement pour l'utilisateur connecté.",

  inputs: {
    stripeToken: {
      type: "string",
      example: "tok_199k3qEXw14QdSnRwmsK99MH",
      description:
        "Le token à usage unique de paiement final de Stripe représentant la source de paiement de l'user (ex: credit card.)",
      extendedDescription:
        "Laisser la chaîne à vide ou ne pas définir de paramètre supprime la source de paiement de l'user",
      whereToGet: {
        description:
          "Le token Stripe.js est apporté au frontend après avoir terminé un encaissement Stripe ou un tunnel d'achat"
      }
    },

    billingCardLast4: {
      type: "string",
      example: "4242",
      description: "Omettre si vous supprimez les informations de paiement.",
      whereToGet: {
        description:
          "Les informations de carte de crédit sont fournies par Stripe après avoir terminé la procédure d'encaissement."
      }
    },

    billingCardBrand: {
      type: "string",
      example: "visa",
      description: "Omettre si vous supprimez les informations de paiement.",
      whereToGet: {
        description:
          "Les informations de carte de crédit sont fournies par Stripe après avoir terminé la procédure d'encaissement."
      }
    },

    billingCardExpMonth: {
      type: "string",
      example: "08",
      description: "Omettre si vous supprimez les informations de paiement.",
      whereToGet: {
        description:
          "Les informations de carte de crédit sont fournies par Stripe après avoir terminé la procédure d'encaissement."
      }
    },

    billingCardExpYear: {
      type: "string",
      example: "2023",
      description: "Omettre si vous supprimez les informations de paiement.",
      whereToGet: {
        description:
          "Les informations de carte de crédit sont fournies par Stripe après avoir terminé la procédure d'encaissement."
      }
    }
  },

  fn: async function(inputs, exits) {
    // Ajoute, met à jour ou supprime la source de paiement par défaut pour l'entrée client
    // de l'utilisateur connecté dans Stripe
    var stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
      stripeCustomerId: this.req.me.stripeCustomerId,
      token: inputs.stripeToken || ""
    });

    // Met à jour ou efface les informations de la carte enregistrées dans notre BDD.
    // > Attention ! Ne jamais enregistrer de numéros de carte en entier-- seulement les 4 derniers digits ainsi que leur date d'expiration.
    // > Enregistrer, ou même recevoir des données de carte non-encryptées et complètes transgresserait les normes de conformité PCI
    // > aux U.S.
    await User.update({ id: this.req.me.id }).set({
      stripeCustomerId,
      hasBillingCard: inputs.stripeToken ? true : false,
      billingCardBrand: inputs.stripeToken ? inputs.billingCardBrand : "",
      billingCardLast4: inputs.stripeToken ? inputs.billingCardLast4 : "",
      billingCardExpMonth: inputs.stripeToken ? inputs.billingCardExpMonth : "",
      billingCardExpYear: inputs.stripeToken ? inputs.billingCardExpYear : ""
    });

    return exits.success();
  }
};
