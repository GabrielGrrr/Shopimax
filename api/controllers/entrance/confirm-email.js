module.exports = {
  friendlyName: "Confirm email",

  description: `Confirme l'email d'un nouvel user, ou d'un user existant demandant un changement d'email,
puis les redirige sur une page output spécialement définir (pour les nouveaux arrivant)
ou sur la page de leur compte (pour ceux qui ont demandé un changement d'adresse).`,

  inputs: {
    token: {
      description: "Le token de confirmation de l'email.",
      example: "4-32fad81jdaf$329"
    }
  },

  exits: {
    success: {
      description: "Adresse email confirmée."
    },

    redirect: {
      description:
        "Adresse email confirmée.  Puisque cela ressemble à un navigateur, on redirige...",
      responseType: "redirect"
    },

    invalidOrExpiredToken: {
      responseType: "expired",
      description: "Le token fournit est invalide, expiré, ou déjà utilisé."
    },

    emailAddressNoLongerAvailable: {
      statusCode: 409,
      viewTemplatePath: "500",
      description: "L'adresse email n'est plus valable.",
      extendedDescription:
        "C'est un cas limite qui n'est pas toujours anticipé par les sites et api web. bla bla bla Since it is pretty rare, the 500 server error page is used as a simple catch-all.  If this becomes important in the future, this could easily be expanded into a custom error page or resolution flow.  But for context: this behavior of showing the 500 server error page mimics how popular apps like Slack behave under the same circumstances."
    }
  },

  fn: async function(inputs, exits) {
    // Si aucun token n'est fourni, automatiquement invalide
    if (!inputs.token) {
      throw "invalidOrExpiredToken";
    }

    // On obtient l'utilisateur correspondant au token
    var user = await User.findOne({ emailProofToken: inputs.token });

    // Si il n'existe pas, invalide.
    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      throw "invalidOrExpiredToken";
    }

    if (user.emailStatus === "unconfirmed") {
      //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦╦═╗╔═╗╔╦╗ ╔╦╗╦╔╦╗╔═╗  ╦ ╦╔═╗╔═╗╦═╗  ┌─┐┌┬┐┌─┐┬┬
      //  │  │ ││││├┤ │├┬┘││││││││ ┬  ╠╣ ║╠╦╝╚═╗ ║───║ ║║║║║╣   ║ ║╚═╗║╣ ╠╦╝  ├┤ │││├─┤││
      //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚  ╩╩╚═╚═╝ ╩   ╩ ╩╩ ╩╚═╝  ╚═╝╚═╝╚═╝╩╚═  └─┘┴ ┴┴ ┴┴┴─┘
      // Si c'est un user confirmant son mail pour la première fois
      // alors, on met simplement à jour son entrée dans la BDD,
      // on enregistre son id dans la session (s'il n'est pas déjà connecté)
      // et on le redirige sur la page d' "email confirmé".
      await User.update({ id: user.id }).set({
        emailStatus: "confirmed",
        emailProofToken: "",
        emailProofTokenExpiresAt: 0
      });
      this.req.session.userId = user.id;

      if (this.req.wantsJSON) {
        return exits.success();
      } else {
        throw { redirect: "/email/confirmed" };
      }
    } else if (user.emailStatus === "changeRequested") {
      //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦ ╦╔═╗╔╗╔╔═╗╔═╗╔╦╗  ┌─┐┌┬┐┌─┐┬┬
      //  │  │ ││││├┤ │├┬┘││││││││ ┬  ║  ╠═╣╠═╣║║║║ ╦║╣  ║║  ├┤ │││├─┤││
      //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚═╝╩ ╩╩ ╩╝╚╝╚═╝╚═╝═╩╝  └─┘┴ ┴┴ ┴┴┴─┘
      if (!user.emailChangeCandidate) {
        throw new Error(
          `Consistency violation: Could not update Stripe customer because this user record's emailChangeCandidate ("${
            user.emailChangeCandidate
          }") is missing.  (This should never happen.)`
        );
      }

      // Ici, on vérifie que personne n'a demandé l'email concerné depuis la dernière vérification
      // que l'on a faite (ce qui, comme la clé en BDD n'est pas unique, peut arriver, voir cas limite plus haut)
      if ((await User.count({ emailAddress: user.emailChangeCandidate })) > 0) {
        throw "emailAddressNoLongerAvailable";
      }

      // Si les fonctionnalités de paiement sont activées, met également à jour le mail de paiement
      // de l'entrée client liée à cet user dans Stripe pour s'assurer qu'il reçoive les reçus (ah ah)
      // par mail.
      // > Note: Si aucune entrée Stripe n'existait pour cet user, on en crée une implicitement.
      // > Il faudra donc la persister. (Cela peut arriver si les certificats Stripe n'étaient pas définis
      // > quand cet user a été créé.)
      if (sails.config.custom.enableBillingFeatures) {
        let didNotAlreadyHaveCustomerId = !user.stripeCustomerId;
        let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
          stripeCustomerId: user.stripeCustomerId,
          emailAddress: user.emailChangeCandidate
        });
        if (didNotAlreadyHaveCustomerId) {
          await User.update({ id: user.id }).set({
            stripeCustomerId
          });
        }
      }

      // Finalement, met à jour l'user dans la BDD, enregistre son id en session
      // (au cas où ils ne soient déjà connectés), puis les redirige vers la page
      // "mon compte" pour qu'ils puissent voir leur adresse mail bien mise à jour.
      await User.update({ id: user.id }).set({
        emailStatus: "confirmed",
        emailProofToken: "",
        emailProofTokenExpiresAt: 0,
        emailAddress: user.emailChangeCandidate,
        emailChangeCandidate: ""
      });
      this.req.session.userId = user.id;
      if (this.req.wantsJSON) {
        return exits.success();
      } else {
        throw { redirect: "/account" };
      }
    } else {
      throw new Error(
        `Erreur de consistence entre les données : l'User ${
          user.id
        } a un token emailProof, mais a tout de même un emailStatus de "${
          user.emailStatus
        }"!  (Cela ne devrait pas arriver.)`
      );
    }
  }
};
