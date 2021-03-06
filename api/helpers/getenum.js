module.exports = {


  friendlyName: 'Getenum',


  description: "Retourne un tableau d'énumération, en fonction de la valeur passée en paramètre. Utilisé uniquement pour refactorer du code.",


  inputs: {
    whichEnum: {
      description: "Quel tableau d'énumération veut-on que la fonction retourne",
      type: "string",
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var res;
    switch (inputs.whichEnum) {
      case "countries":
        res = [
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
        ];
        break;
      case "sectors":
        res = [
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
        ];
        break;
      case "statuses":
        res = [
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
        ];
        break;
    }
    // All done.
    return exits.success(res);

  }


};

