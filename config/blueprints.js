/**
 * Blueprint API Configuration
 * (sails.config.blueprints)
 *
 * Pour plus d'infos sur l'API Blueprint dans Sails, voir :
 * https://sailsjs.com/docs/reference/blueprint-api
 *
 * Pour plus de détails et d'options disponibles, voir :
 * https://sailsjs.com/config/blueprints
 */

module.exports.blueprints = {
  /***************************************************************************
   *                                                                          *
   * Afficher automatiquement les routes implicites pour chaque action?       *
   *                                                                          *
   ***************************************************************************/

  // actions: false,

  /***************************************************************************
   *                                                                          *
   * Afficher automatiquement les routes RESTful pour chaque model?           *
   *                                                                          *
   ***************************************************************************/

  rest: false,

  /***************************************************************************
   *                                                                          *
   * Afficher automatiquement les routes "shortcut" de CRUD pour les          *
   * requêtes GET ?                                                           *
   * (Autorisé par défaut seulement en mode dev.)                             *
   *                                                                          *
   ***************************************************************************/

  shortcuts: false
};
