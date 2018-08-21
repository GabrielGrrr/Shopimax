/**
 * User.js
 *
 * Un utilisateur qui peut se connecter dans l'application.
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "elsa.validovna@madmoizelle.com"
    },

    password: {
      type: "string",
      required: true,
      description: "Représentation cryptée d'un mot de passe utilisateur.",
      protect: true,
      example: "2$28a8eabna301089103-13948134nad"
    },

    fullName: {
      type: "string",
      required: true,
      description: "Représentation d'un nom d'utilisateur",
      maxLength: 120,
      example: "Lisa Microwave van der Jenny"
    },

    isSuperAdmin: {
      type: "boolean",
      description: "Explicite",
      extendedDescription: `Mauvaise idée, on va plutôt utiliser une enum`
    },

    passwordResetToken: {
      type: "string",
      description:
        "Chaîne de caractère unique envoyée à l'utilisateur pour l'identifier lors de la perte d'un mot de passe.  Expire au premier usage ou périme."
    },

    passwordResetTokenExpiresAt: {
      type: "number",
      description:
        "Un timestamp (epoch ms) représentant le moment où le token expire, vaut 0 si null.",
      example: 1502844074211
    },

    stripeCustomerId: {
      type: "string",
      protect: true,
      description:
        "L'id de ce client dans Stripe (ou chaîne de caractère vide si Stripe n'est pas activé).",
      extendedDescription: `La présence d'un id Stripe n'implique pas nécessairement la possession d'une carte de paiement associée à ce compte Stripe.`
    },

    hasBillingCard: {
      type: "boolean",
      description:
        "Vérifie la possession d'une carte de paiement associée au compte Stripe utilisateur.",
      extendedDescription: `Plus précisément, inqique si l'entrée utilisateur correspondant à cet id utilisateur dans Stripe possède un système de paiement par défaut.`
    },

    billingCardBrand: {
      type: "string",
      example: "Visa",
      description:
        "La marque de la carte de paiement de cet utilisateur, ou chaîne de caractère vide.",
      extendedDescription:
        "Par conformité à la norme PCI DCSS, cette donnée vient de Stripe, où elle représente la source de paiement par défaut de l'utilisateur."
    },

    billingCardLast4: {
      type: "string",
      example: "4242",
      description:
        "Les 4 derniers chiffres de la carte de paiement utilisateur, ou chaîne vide.",
      extendedDescription:
        "Par conformité à la norme PCI DCSS, cette donnée vient de Stripe, où elle représente la source de paiement par défaut de l'utilisateur."
    },

    billingCardExpMonth: {
      type: "string",
      example: "08",
      description:
        "Le mois d'expiration de la carte, en deux chiffres, formatés en MM, ou chaîne vide.",
      extendedDescription:
        "Par conformité à la norme PCI DCSS, cette donnée vient de Stripe, où elle représente la source de paiement par défaut de l'utilisateur."
    },

    billingCardExpYear: {
      type: "string",
      example: "2023",
      description: "Année d'expiration, formatée en YYYY, ou chaîne vide.",
      extendedDescription:
        "Par conformité à la norme PCI DCSS, cette donnée vient de Stripe, où elle représente la source de paiement par défaut de l'utilisateur."
    },

    emailProofToken: {
      type: "string",
      description:
        "Un token, pseudo-random, probablement unique, utilisé pour la confirmation de compte par e-mail."
    },

    emailProofTokenExpiresAt: {
      type: "number",
      description:
        "Un timestamp (epoch ms) représentant le moment où le token expire, vaut 0 si null.",
      example: 1502844074211
    },

    emailStatus: {
      type: "string",
      isIn: ["unconfirmed", "changeRequested", "confirmed"],
      defaultsTo: "confirmed",
      description:
        "Statut de confirmation de l'adresse e-mail de cet utilisateur.",
      extendedDescription: `Les utilisateurs peuvent être créés comme étant confirmés ou non-confirmés.  
      Quand le service de confirmation d'e-mail est activé, les formulaires d'inscription on le statut 
"unconfirmed" jusqu'à la validation du lien de confirmation envoyé par email.
Aussi, quand un utilisateur demande un changement de password, son statut devient "changeRequested"
jusqu'à la validation du lien de confirmation envoyé par email.`
    },

    emailChangeCandidate: {
      type: "string",
      description:
        "L'e-mail en cours de confirmation que l'utilisateur souhaite substituer à son email actuel."
    },

    tosAcceptedByIp: {
      type: "string",
      description:
        "L'IP (ipv4) de l'user ayant accepté les conditions du service.",
      extendedDescription:
        "Utile dans certaines entreprises et pour des contraintes de régulation (KYC, etc.)",
      moreInfoUrl: "https://en.wikipedia.org/wiki/Know_your_customer"
    },

    lastSeenAt: {
      type: "number",
      description:
        "Un timestamp (epoch ms) représentant le dernier moment où l'user a interagit avec le backend, ou 0 si null.",
      example: 1502844074211
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a
  }
};
