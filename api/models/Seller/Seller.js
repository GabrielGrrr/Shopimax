/**
 * Seller.js
 *
 * @description :: FR : Un modèle qui recense une entreprise. Ce modèle de base, relativement exhaustif, ne prend pas en compte le traitement et le stockage des documents
 * attestant des différentes informations précisées ici (extrait K-bis, etc.), ni les informations relatives aux transactions financières puisque cette fonctionnalité ne sera
 * jamais activée dans cette application.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    companyName: {
      type: "string",
      required: true,
      description: "Dénomination sociale",
      maxLength: 131,
      minLength: 2,
      example: "Europa Corp"
    },
    statutJuridique: {
      type: "string",
      required: true,
      isIn: [
        "S.A.",
        "S.A.S.",
        "S.A.S.U.",
        "S.A.R.L.",
        "E.U.R.L.",
        "S.C.",
        "S.C.I.",
        "S.N.C.",
        "auto/micro-entreprise",
        "E.I.R.L.",
        "Association"
      ],
      maxLength: 20,
      example: "S.A.R.L."
    },
    dateCreation: {
      type: "string",
      required: true,
      isBefore: new Date(),
      maxLength: 20,
      example: "01/04/1976"
    },
    sector: {
      type: "string",
      required: false,
      isIn: [
        "Agriculture",
        "Mode, industrie textile",
        "Industrie alimentaire",
        "Chimie, pharmacie",
        "Audiovisuel - Spectacle",
        "Social",
        "Énergie",
        "Construction aéronautique, ferroviaire et navale",
        "Banque, assurance",
        "Maintenance, entretien",
        "Fonction publique",
        "Edition, Journalisme",
        "Armée, sécurité",
        "Recherche",
        "Informatique et télécoms",
        "Commerce, distribution",
        "Audit, gestion",
        "Sport, loisirs – Tourisme",
        "Enseignement",
        "Culture - Artisanat d'art",
        "Électronique",
        "Mécanique",
        "Hôtellerie, restauration",
        "Logistique, transport",
        "Art, Design",
        "Santé",
        "Traduction - interprétariat",
        "Communication - Marketing - Pub",
        "Automobile",
        "BTP, architecture",
        "Environnement",
        "Droit, justice",
        " Verre, béton, céramique"
      ],
      maxLength: 50,
      description: "Secteur d'activité",
      example: "Textile"
    },
    nbEmployee: {
      type: "number",
      required: true,
      defaultsTo: 1,
      min: 1,
      description: "Nombre de salariés"
    },
    siren: {
      type: "string",
      required: true,
      maxLength: 11,
      description: "Identifiant SIREN",
      example: "123 456 789"
    },
    siret: {
      type: "string",
      required: false,
      maxLength: 17,
      description: "Identifiant SIRET",
      example: "123 456 789 12345"
    },
    rcs: {
      type: "string",
      required: true,
      maxLength: 40,
      description: "Identifiant au registre du commerce et des sociétés",
      example: "123 456 789 RCS de Paris"
    },
    numTVA: {
      type: "string",
      required: false,
      maxLength: 17,
      description: "Identifiant de T.V.A. intracommunautaire",
      example: "FR 12 123 456 789"
    },
    website: {
      type: "string",
      isURL: true,
      description: "Le site web de la société, si elle en a un",
      example: "http://www.armabuwax.com"
    },
    // CONTACT INFORMATIONS
    fullname: {
      type: "string",
      required: true,
      description: "Nom complet du contact dans l'entreprise",
      maxLength: 100,
      example: "Olga Invalidovna"
    },
    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 120,
      example: "rembrandt.armenszoon.van.rijn@madmoizelle.com"
    },
    phoneNumber: {
      type: "string",
      required: true,
      maxLength: 15
    },
    password: {
      type: "string",
      required: true,
      description: "Représentation cryptée d'un mot de passe utilisateur.",
      protect: true,
      example: "2$28a8eabna301089103-13948134nad"
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
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    siegeSocial: {
      model: "address"
    }
  }
};
