/**
 * unauthorized.js
 *
 * Une réponse personnalisée qui modifie le conenu de la requête actuelle pour qu'il :
 *  • déconnecte l'user et le redirige vers son login
 *  • ou renvoie une erreur 401 (Unauthorized) sans corps de réponse.
 *
 * Exemple:
 * ```
 *     return res.unauthorized();
 * ```
 *
 * Ou:
 * ```
 *     exits: {
 *       badCombo: {
 *         description: 'That email address and password combination is not recognized.',
 *         responseType: 'unauthorized'
 *       }
 *     }
 * ```
 */
module.exports = function unauthorized() {
  var req = this.req;
  var res = this.res;

  sails.log.verbose("Envoyé réponse personnalisée : res.unauthorized()");

  if (req.wantsJSON) {
    return res.sendStatus(401);
  }
  // Ou déconnexion de l'user (si nécessaire) puis redirection vers le login.
  else {
    if (req.session.userId) {
      delete req.session.userId;
    }

    return res.redirect("/login");
  }
};
