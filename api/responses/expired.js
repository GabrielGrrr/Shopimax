/**
 * expired.js
 *
 * Une réponse personnalisée qui modifie le conenu de la requête actuelle pour qu'il :
 *  • serve une page HTML d'erreur a propos du token spécifié étant invalide ou expiré
 *  • ou envoie une erreur 498 (Token Expired/Invalid) sans corps de réponse.
 *
 * Exemple :
 * ```
 *     return res.expired();
 * ```
 *
 * Ou :
 * ```
 *     exits: {
 *       badToken: {
 *         description: 'Provided token was expired, invalid, or already used up.',
 *         responseType: 'expired'
 *       }
 *     }
 * ```
 */
module.exports = function expired() {
  var req = this.req;
  var res = this.res;

  sails.log.verbose("Envoyé réponse personnalisée : res.expired()");

  if (req.wantsJSON) {
    return res.status(498).send("Token Expired/Invalid");
  } else {
    return res.status(498).view("498");
  }
};
