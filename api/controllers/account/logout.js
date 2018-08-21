module.exports = {
  friendlyName: "Déconnexion",

  description: "Déconnecte l'user.",

  extendedDescription: `Cette action supprime la clé \`req.session.userId\` de la session de l'agent utilisateur envoyant la requête.
Le 'garbage collection' des données de session dépend du registre de session de cette appli, et potentiellement également de la 
[TTL configuration](https://sailsjs.com/docs/reference/configuration/sails-config-session)
définie le concernant.

Cette action ne vérifie pas si l'user était bien logged in.  (Si ce n'est pas le cas, elle ne fait rien.)`,

  exits: {
    success: {
      description: "L'utilisateur a bien été déconnecté."
    },

    redirect: {
      description: "L'utilisateur semble être un navigateur web.",
      extendedDescription:
        "Après déconnexion d'un navigateur web, l'user est redirigé.",
      responseType: "redirect"
    }
  },

  fn: async function(inputs, exits) {
    // Supprime la propriété `userId` de cette session.
    delete this.req.session.userId;

    // Puis termine, envoyant une réponse appropriée
    // > Implicitement, cela persiste la session désormais logged out
    // > dans le registre de session sous-jacent
    if (!this.req.wantsJSON) {
      throw { redirect: "/login" };
    } else {
      return exits.success();
    }
  }
};
