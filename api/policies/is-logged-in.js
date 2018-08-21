/**
 * is-logged-in
 *
 * Une simple règle d'utilisation qui autorise toute requête venant d'un user authentifié
 *
 * Pour en savoir plus sur les règles d'utilisation / policies, voir :
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function(req, res, proceed) {
  // Si `req.me` est défini, alors on sait que cette requête provient d'un
  // user connecté.  On peut donc sereinement avancer jusqu'à la prochaine règle--
  // ou, si c'est la dernière, à l'action idoine.
  // > Pour en savoir plus sur `req.me` aller voir l'hook custom de ce site
  // > (`api/hooks/custom/index.js`).
  if (req.me) {
    return proceed();
  }

  //--•
  // Sinon, cette requête ne provient pas d'un user connecté
  return res.unauthorized();
};
