/**
 * custom hook
 *
 * @description :: Un hook custom.  Il prolonge (extend) Sails en ajoutant des routes et actions implicites, et/ou des processus d'initialisation.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCustomHook(sails) {
  return {
    /**
     * Démarre quand l'app sails loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function(done) {
      sails.log.info("Initializing hook... (`api/hooks/custom`)");

      // Vérifie la config de Stripe/Mailgun (pour le paiement et les mails).
      var IMPORTANT_STRIPE_CONFIG = ["stripeSecret", "stripePublishableKey"];
      var IMPORTANT_MAILGUN_CONFIG = [
        "mailgunSecret",
        "mailgunDomain",
        "internalEmailAddress"
      ];
      var isMissingStripeConfig =
        _.difference(IMPORTANT_STRIPE_CONFIG, Object.keys(sails.config.custom))
          .length > 0;
      var isMissingMailgunConfig =
        _.difference(IMPORTANT_MAILGUN_CONFIG, Object.keys(sails.config.custom))
          .length > 0;

      if (isMissingStripeConfig || isMissingMailgunConfig) {
        let missingFeatureText =
          isMissingStripeConfig && isMissingMailgunConfig
            ? "billing and email"
            : isMissingStripeConfig
              ? "billing"
              : "email";
        let suffix = "";
        if (_.contains(["silly"], sails.config.log.level)) {
          suffix = `
> Tip: Pour exclure les informations de connexion sensible en contrôle de source, utiliser:
> • config/local.js (pour le dévelopement local)
> • les variables d'environnement (pour la production)
>
> Si vous voulez les vérifier en contrôle de source, utiliser:
> • config/custom.js  (pour le dévelopement)
> • config/env/staging.js  (pour le staging)
> • config/env/production.js  (pour la production)
>
> (Voir https://sailsjs.com/docs/concepts/configuration pour une assistance à la config de Sails.)
`;
        }

        let problems = [];
        if (sails.config.custom.stripeSecret === undefined) {
          problems.push(
            "Aucun `sails.config.custom.stripeSecret` a été configuré."
          );
        }
        if (sails.config.custom.stripePublishableKey === undefined) {
          problems.push(
            "Aucun `sails.config.custom.stripePublishableKey` a été configuré."
          );
        }
        if (sails.config.custom.mailgunSecret === undefined) {
          problems.push(
            "Aucun `sails.config.custom.mailgunSecret` a été configuré."
          );
        }
        if (sails.config.custom.mailgunDomain === undefined) {
          problems.push(
            "Aucun `sails.config.custom.mailgunDomain` a été configuré."
          );
        }
        if (sails.config.custom.internalEmailAddress === undefined) {
          problems.push(
            "Aucun `sails.config.custom.internalEmailAddress` a été configuré."
          );
        }

        sails.log.verbose(
          `Des paramètres optionnels n'ont toujours pas été configurés:
---------------------------------------------------------------------
${problems.join("\n")}

Tant que le problème ne sera pas résolu, les fonctionnalités ${missingFeatureText} 
de l'appli seront désactivées ou camouflées dans l'UI.

 [?] Si vous n'êtes pas sûr ou avez besoin d'un conseil, allez voir https://sailsjs.com/support
---------------------------------------------------------------------${suffix}`
        );
      } //ﬁ

      // Défini des clés de configuration additionnelles selon si la config Stripe est disponible.
      // Cela déterminera s'il faut ou non activer les fonctionnalités de paiement.
      sails.config.custom.enableBillingFeatures = !isMissingStripeConfig;

      // Après que "sails-hook-organics" finisse de s'initialiser, on configure les packages Stripe
      // et Mailgun avec les données de connexion disponibles.
      sails.after("hook:organics:loaded", () => {
        sails.helpers.stripe.configure({
          secret: sails.config.custom.stripeSecret
        });

        sails.helpers.mailgun.configure({
          secret: sails.config.custom.mailgunSecret,
          domain: sails.config.custom.mailgunDomain,
          from: sails.config.custom.fromEmailAddress,
          fromName: sails.config.custom.fromName
        });
      }); //_∏_

      // ... Mettre ici les code d'initialisation de n'importe quel autre app qui ont besoin d'être lancés avec lift, même en prod ...

      return done();
    },

    routes: {
      /**
       * Exécuté avant n'importe quelle route correspondante
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        "/*": {
          skipAssets: true,
          fn: async function(req, res, next) {
            var url = require("url");

            // D'abord, si c'est une GET request (et donc potentiellement une vue en retour),
            // on attache quelques variables locales.
            if (req.method === "GET") {
              // La variable  `_environment` nous permet de faire marcher Vue.js
              // en "production mode" sans faire intervenir de complexités superflues avec
              // les webpack et al.)
              if (res.locals._environment !== undefined) {
                throw new Error(
                  "Impossible de joindre l'environnement Sails comme `_environment` local à la vue, car celui-ci existe déjà !  (Est-il injecté ailleurs ?)"
                );
              }
              res.locals._environment = sails.config.environment;

              // Le `me` local est défini explicitement à `undefined` pour éviter d'avoir à faire
              // un check `typeof me !== 'undefined'`dans views/layouts/partials.
              // > Notez bien que, en fonction de la requête, il peut être défini par l'entrée
              // > utilisateur de l'user connecté en-dessous.
              if (res.locals.me !== undefined) {
                throw new Error(
                  "Impossible de joindre la vue locale `me`, car elle existe déjà !  (Est-elle injecté ailleurs ?)"
                );
              }
              res.locals.me = undefined;
            } //ﬁ

            // Ensuite, si l'on est en mode prod ou "staging",
            // on vérifie si c'est une requête GET via d'autres sous-domaines,
            // par exemple quelque chose comme 'webhooks.' ou 'click.'. Si c'est le cas,
            // on avance automatiquement et on redirige vers le chemin correspondant sous
            // l'URL de base, qui est environment-specific.
            // > Notez que l'on ne REDIRIGE NI LES requêtes sockets virtuelles
            // > NI LES requêtes non-GET (car cela peut confondre certaines plateformes 3rd party
            // > qui envoient des requêtes webhook.)
            var configuredBaseSubdomain;
            try {
              configuredBaseSubdomain = url
                .parse(sails.config.custom.baseUrl)
                .host.match(/^([^\.]+)\./)[1];
            } catch (unusedErr) {
              /*…*/
            }
            if (
              (sails.config.environment === "staging" ||
                sails.config.environment === "production") &&
              !req.isSocket &&
              req.method === "GET" &&
              req.subdomains[0] !== configuredBaseSubdomain
            ) {
              sails.log.info(
                "... On redirige la requête GET depuis le sous-domaine `" +
                  req.subdomains[0] +
                  ".` ..."
              );
              return res.redirect(sails.config.custom.baseUrl + req.url);
            } //•

            // Pas de session ? On procède comme d'habitude
            // (ex: requête pour un asset statique)
            if (!req.session) {
              return next();
            }

            // Pas connecté ? On procède comme d'habitude
            if (!req.session.userId) {
              return next();
            }

            // Sinon, on trouve l'user connecté
            var loggedInUser = await User.findOne({
              id: req.session.userId
            });

            // S'il n'existe plus, on lance un warning
            // on efface l'id user de la session de l'user
            // et on renvoie la réponse "unauthorized".
            if (!loggedInUser) {
              sails.log.warn(
                "Apparemment, l'entrée user correspondant à l'utilisateur connecté (`" +
                  req.session.userId +
                  "`) a disparu...."
              );
              delete req.session.userId;
              return res.unauthorized();
            }

            // Ajoute des informations additionnelles par praticité lors de la construction de la navigation à haut niveau.
            // (i.e. afficher ou non "Dashboard", "My Account", etc.)
            if (
              !loggedInUser.password ||
              loggedInUser.emailStatus === "unconfirmed"
            ) {
              loggedInUser.dontDisplayAccountLinkInNav = true;
            }

            // Expose l'entrée user comme propriété de l'objet request(`req.me`).
            // > Note that we make sure `req.me` doesn't already exist first.
            if (req.me !== undefined) {
              throw new Error(
                "Impossible de joindre l'utilisateur connecté comme `req.me` car cette propriété existe déjà !  (Est-il injecté ailleurs ?)"
              );
            }
            req.me = loggedInUser;

            // Si l'attribut "lastSeenAt" de cet utilisateur est vieux d'au moins quelques secondes, alors le définir comme le
            // timestamp actuel.
            // (Note: Par optimisation, on exécute cette tâche en background pour éviter toute latence inutile.)
            var MS_TO_BUFFER = 60 * 1000;
            var now = Date.now();
            if (loggedInUser.lastSeenAt < now - MS_TO_BUFFER) {
              User.update({ id: loggedInUser.id })
                .set({ lastSeenAt: now })
                .exec(err => {
                  if (err) {
                    sails.log.error(
                      "La tâche en background a échouté : impossible de mettre à jour l'user (`" +
                        loggedInUser.id +
                        "`) avec un nouveau `lastSeenAt` timestamp.  Détails: " +
                        err.stack
                    );
                    return;
                  } //•
                  sails.log.verbose(
                    "Mis à jour le `lastSeenAt` timestamp pour l'utilisateur `" +
                      loggedInUser.id +
                      "`."
                  );
                  // Rien d'autre à faire ici.
                }); //_∏_  (Meanwhile...)
            } //ﬁ

            // Si c'est une requête GET, alors on expose une variable locale supplémentaire (`<%= me %>`).
            // > Notez que l'on vérifie préalablement qu'une locale du même nom n'existe pas déjà.
            // > Aussi, notez que l'on retire toute propriété protected de l'objet.
            if (req.method === "GET") {
              if (res.locals.me !== undefined) {
                throw new Error(
                  "Impossible de joindre l'utilisateur connecté comme variable locale `me` dans la vue, car celle-ci existe déjà !  (Est-elle injectée ailleurs ?)"
                );
              }

              // Exclure tout champ correspondant avec les attributs `protect: true`.
              var sanitizedUser = _.extend({}, loggedInUser);
              for (let attrName in User.attributes) {
                if (User.attributes[attrName].protect) {
                  delete sanitizedUser[attrName];
                }
              } //∞

              // Si un mot de passe existe toujours dans les données users "assainies", alors, le supprimer par sécurité.
              // (Mais aussi logger un avertissement pour que cela ne soit pas trop déroutant.)
              if (sanitizedUser.password) {
                sails.log.warn(
                  "L'user connecté a une propriété `password`, qui était toujours présente après avoir extrait les propriétés protected du modèle." +
                    "Donc, par sécurité, on le retire quand même ..."
                );
                delete sanitizedUser.password;
              } //ﬁ

              res.locals.me = sanitizedUser;

              // Inclue des informations en variable locales concernant l'activation ou non des fonctionnalités
              // de paiement, et selon si oui ou non la vérification par mail est requise.
              res.locals.isBillingEnabled =
                sails.config.custom.enableBillingFeatures;
              res.locals.isEmailVerificationRequired =
                sails.config.custom.verifyEmailAddresses;
            } //ﬁ

            // Empêche le browser de mettre les pages "logged in" en cache
            // (incluant w/ le Chrome back button)
            // > • https://mixmax.com/blog/chrome-back-button-cache-no-store
            // > • https://madhatted.com/2013/6/16/you-do-not-understand-browser-history
            res.setHeader("Cache-Control", "no-cache, no-store");

            return next();
          }
        }
      }
    }
  };
};
