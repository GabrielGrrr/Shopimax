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
    },

    country: {
      type: "string",
      defaultsTo: "France",
      description: "Pays de résidence",
      isIn: [
        "Afghanistan",
        "Afrique du Sud",
        "Albanie",
        "Algérie",
        "Allemagne",
        "Andorre",
        "Angola",
        "Anguilla",
        "Antarctique",
        "Antigua-et-Barbuda",
        "Antilles néerlandaises",
        "Arabie saoudite",
        "Argentine",
        "Arménie",
        "Aruba",
        "Australie",
        "Autriche",
        "Azerbaïdjan",
        "Bahamas",
        "Bahreïn",
        "Bangladesh",
        "Barbade",
        "Bélarus",
        "Belgique",
        "Belize",
        "Bénin",
        "Bermudes",
        "Bhoutan",
        "Bolivie",
        "Bosnie-Herzégovine",
        "Botswana",
        "Brésil",
        "Brunéi Darussalam",
        "Bulgarie",
        "Burkina Faso",
        "Burundi",
        "Cambodge",
        "Cameroun",
        "Canada",
        "Cap-Vert",
        "Ceuta et Melilla",
        "Chili",
        "Chine",
        "Chypre",
        "Colombie",
        "Comores",
        "Congo-Brazzaville",
        "Corée du Nord",
        "Corée du Sud",
        "Costa Rica",
        "Côte d’Ivoire",
        "Croatie",
        "Cuba",
        "Danemark",
        "Diego Garcia",
        "Djibouti",
        "Dominique",
        "Égypte",
        "El Salvador",
        "Émirats arabes unis",
        "Équateur",
        "Érythrée",
        "Espagne",
        "Estonie",
        "État de la Cité du Vatican",
        "États fédérés de Micronésie",
        "États-Unis",
        "Éthiopie",
        "Fidji",
        "Finlande",
        "France",
        "Gabon",
        "Gambie",
        "Géorgie",
        "Géorgie du Sud et les îles Sandwich du Sud",
        "Ghana",
        "Gibraltar",
        "Grèce",
        "Grenade",
        "Groenland",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernesey",
        "Guinée",
        "Guinée équatoriale",
        "Guinée-Bissau",
        "Guyana",
        "Guyane française",
        "Haïti",
        "Honduras",
        "Hongrie",
        "Île Bouvet",
        "Île Christmas",
        "Île Clipperton",
        "Île de l'Ascension",
        "Île de Man",
        "Île Norfolk",
        "Îles Åland",
        "Îles Caïmans",
        "Îles Canaries",
        "Îles Cocos - Keeling",
        "Îles Cook",
        "Îles Féroé",
        "Îles Heard et MacDonald",
        "Îles Malouines",
        "Îles Mariannes du Nord",
        "Îles Marshall",
        "Îles Mineures Éloignées des États-Unis",
        "Îles Salomon",
        "Îles Turks et Caïques",
        "Îles Vierges britanniques",
        "Îles Vierges des États-Unis",
        "Inde",
        "Indonésie",
        "Irak",
        "Iran",
        "Irlande",
        "Islande",
        "Israël",
        "Italie",
        "Jamaïque",
        "Japon",
        "Jersey",
        "Jordanie",
        "Kazakhstan",
        "Kenya",
        "Kirghizistan",
        "Kiribati",
        "Koweït",
        "Laos",
        "Lesotho",
        "Lettonie",
        "Liban",
        "Libéria",
        "Libye",
        "Liechtenstein",
        "Lituanie",
        "Luxembourg",
        "Macédoine",
        "Madagascar",
        "Malaisie",
        "Malawi",
        "Maldives",
        "Mali",
        "Malte",
        "Maroc",
        "Martinique",
        "Maurice",
        "Mauritanie",
        "Mayotte",
        "Mexique",
        "Moldavie",
        "Monaco",
        "Mongolie",
        "Monténégro",
        "Montserrat",
        "Mozambique",
        "Myanmar",
        "Namibie",
        "Nauru",
        "Népal",
        "Nicaragua",
        "Niger",
        "Nigéria",
        "Niue",
        "Norvège",
        "Nouvelle-Calédonie",
        "Nouvelle-Zélande",
        "Oman",
        "Ouganda",
        "Ouzbékistan",
        "Pakistan",
        "Palaos",
        "Panama",
        "Papouasie-Nouvelle-Guinée",
        "Paraguay",
        "Pays-Bas",
        "Pérou",
        "Philippines",
        "Pitcairn",
        "Pologne",
        "Polynésie française",
        "Porto Rico",
        "Portugal",
        "Qatar",
        "R.A.S. chinoise de Hong Kong",
        "R.A.S. chinoise de Macao",
        "régions éloignées de l’Océanie",
        "République centrafricaine",
        "République démocratique du Congo",
        "République dominicaine",
        "République tchèque",
        "Réunion",
        "Roumanie",
        "Royaume-Uni",
        "Russie",
        "Rwanda",
        "Sahara occidental",
        "Saint-Barthélémy",
        "Saint-Kitts-et-Nevis",
        "Saint-Marin",
        "Saint-Martin",
        "Saint-Pierre-et-Miquelon",
        "Saint-Vincent-et-les Grenadines",
        "Sainte-Hélène",
        "Sainte-Lucie",
        "Samoa",
        "Samoa américaines",
        "Sao Tomé-et-Principe",
        "Sénégal",
        "Serbie",
        "Serbie-et-Monténégro",
        "Seychelles",
        "Sierra Leone",
        "Singapour",
        "Slovaquie",
        "Slovénie",
        "Somalie",
        "Soudan",
        "Sri Lanka",
        "Suède",
        "Suisse",
        "Suriname",
        "Svalbard et Île Jan Mayen",
        "Swaziland",
        "Syrie",
        "Tadjikistan",
        "Taïwan",
        "Tanzanie",
        "Tchad",
        "Terres australes françaises",
        "Territoire britannique de l'océan Indien",
        "Territoire palestinien",
        "Thaïlande",
        "Timor oriental",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinité-et-Tobago",
        "Tristan da Cunha",
        "Tunisie",
        "Turkménistan",
        "Turquie",
        "Tuvalu",
        "Ukraine",
        "Union européenne",
        "Uruguay",
        "Vanuatu",
        "Venezuela",
        "Viêt Nam",
        "Wallis-et-Futuna",
        "Yémen",
        "Zambie",
        "Zimbabwe"
      ]
    },
    area: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "État/Province/Région",
      example: "Occitanie"
    },
    city: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Ville",
      example: "Bombay"
    },
    address: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Adresse postale / Boîte postale",
      example: "221B Baker Street"
    },
    additionnalAddress: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Complément d'adresse",
      example: "Appartement B, 2ème étage etc."
    },
    postalCode: {
      type: "string",
      defaultsTo: "34000",
      maxLength: 120,
      description: "Code Postal",
      example: "34090"
    },
    phoneNumber: {
      type: "string",
      required: true,
      maxLength: 15
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

    invalidAddress: {
      responseType: "badRequest",
      description: "L'adresse fournie n'est pas valide.",
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
    sails.log(inputs);
    var newUserAddress = await Address.create({
      country: "France",
      area: "inputs.area",
      city: "inputs.city",
      address: "inputs.address",
      additionnalAddress: "inputs.additionnalAddress",
      postalCode: "inputs.postalCode",
      phoneNumber: "inputs.phone"
    })
      .intercept({ name: "UsageError" }, "invalid")
      .fetch();
    sails.log(newUserAddress);
    // Construit les données pour le nouvel utilisateur et les enregistre dans le SGBD
    // (Aussi, utilise `fetch` pour récupérer le nouvel ID afin que l'on puisse l'utiliser ci-dessous.)
    var newUserRecord = await User.create(
      Object.assign(
        {
          emailAddress: newEmailAddress,
          password: await sails.helpers.passwords.hashPassword(inputs.password),
          fullName: inputs.fullName,
          tosAcceptedByIp: this.req.ip,
          address: newUserAddress.id
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
