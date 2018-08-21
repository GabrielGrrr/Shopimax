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
      // On utilise ici la réponse "unauthorized" customisée dans `api/responses/unauthorized.js`.
      // Pour customiser cette réponse pour seulement cette action, remplacer `responseType` avec
      // autre chose.  Par exemple, vous pourriez définir `statusCode: 498` et changer
      // l'implémentation ci-dessous en fonction (voir http://sailsjs.com/docs/concepts/controllers).
    }
  },

  fn: async function(inputs, exits) {
    // On trouve l'user par son mail. (on s'assure que l'adresse
    //soit toujours insensible, quel que soit le SGBD à la casse avec le toLowerCase call)
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

    // Si "Remember me" a été coché, prolonger la session user
    // (Cela produit une mise à jour d'header de requête "Set Cookie"
    // qui sera envoyée comme résultat à cette requête -- ainsi,
    // il nous faut avoir affaire à une requête HTTP traditionnelle pour que
    // cela puisse fonctionner.)
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

    // Modifie l'instance de session active.
    this.req.session.userId = userRecord.id;

    // Envoie la réponse success (la session est ici véritablement persistée)
    return exits.success();
  }
};
