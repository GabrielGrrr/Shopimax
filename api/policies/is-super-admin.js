/**
 * is-super-admin
 *
 * Une simple règle d'utilisation qui bloque les règle ne provenant pas d'un super-admin
 *
 * Pour en savoir plus sur les règles d'utilisation / policies, voir :
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function(req, res, proceed) {
  // D'abord, on vérifie sir la requête provient d'un user connecté
  // > Pour en savoir plus sur `req.me` aller voir l'hook custom de ce site
  // > (`api/hooks/custom/index.js`).
  if (!req.me) {
    return res.unauthorized();
  } //•

  // Puis, on vérifie que le statut corresponde à un SU
  if (!req.me.isSuperAdmin) {
    return res.forbidden();
  } //•

  //On a bien un SU
  return proceed();
};
