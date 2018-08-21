module.exports = {
  friendlyName: "Mise à jour du profil",

  description: "Met à jour le profil de l'utilisateur connecté.",

  inputs: {
    fullName: {
      type: "string"
    },

    emailAddress: {
      type: "string"
    }
  },

  exits: {
    emailAlreadyInUse: {
      statusCode: 409,
      description: "L'email fournit est déjà utilisé."
    }
  },

  fn: async function(inputs, exits) {
    var newEmailAddress = inputs.emailAddress;
    if (newEmailAddress !== undefined) {
      newEmailAddress = newEmailAddress.toLowerCase();
    }

    // Détermine si cette requête veut modifier le mail de l'user connecté,
    // annuler son changement d'email en cours, modifier son nouvel email, ou si l'adresse email ne sera pas du tout affectée.
    var desiredEffectReEmail; // ('changeImmediately', 'beginChange', 'cancelPendingChange', 'modifyPendingChange', or '')
    if (
      newEmailAddress === undefined ||
      (this.req.me.emailStatus !== "changeRequested" &&
        newEmailAddress === this.req.me.emailAddress) ||
      (this.req.me.emailStatus === "changeRequested" &&
        newEmailAddress === this.req.me.emailChangeCandidate)
    ) {
      desiredEffectReEmail = "";
    } else if (
      this.req.me.emailStatus === "changeRequested" &&
      newEmailAddress === this.req.me.emailAddress
    ) {
      desiredEffectReEmail = "cancelPendingChange";
    } else if (
      this.req.me.emailStatus === "changeRequested" &&
      newEmailAddress !== this.req.me.emailAddress
    ) {
      desiredEffectReEmail = "modifyPendingChange";
    } else if (
      !sails.config.custom.verifyEmailAddresses ||
      this.req.me.emailStatus === "unconfirmed"
    ) {
      desiredEffectReEmail = "changeImmediately";
    } else {
      desiredEffectReEmail = "beginChange";
    }

    // Si l'adresse email change, s'assurer qu'elle ne soit pas déjà utilisée.
    if (
      _.contains(
        ["beginChange", "changeImmediately", "modifyPendingChange"],
        desiredEffectReEmail
      )
    ) {
      let conflictingUser = await User.findOne({
        or: [
          { emailAddress: newEmailAddress },
          { emailChangeCandidate: newEmailAddress }
        ]
      });
      if (conflictingUser) {
        throw "emailAlreadyInUse";
      }
    }

    // Commence à construire les valeurs à entrer dans la BDD
    // Toujours mettre le fullname s'il est soumit
    var valuesToSet = {
      fullName: inputs.fullName
    };

    switch (desiredEffectReEmail) {
      // Change le mail tout de suite
      case "changeImmediately":
        Object.assign(valuesToSet, {
          emailAddress: newEmailAddress,
          emailChangeCandidate: "",
          emailProofToken: "",
          emailProofTokenExpiresAt: 0,
          emailStatus:
            this.req.me.emailStatus === "unconfirmed"
              ? "unconfirmed"
              : "confirmed"
        });
        break;

      // Commencer le nouveau changement de mail, ou le changement de mail en attente
      case "beginChange":
      case "modifyPendingChange":
        Object.assign(valuesToSet, {
          emailChangeCandidate: newEmailAddress,
          emailProofToken: await sails.helpers.strings.random("url-friendly"),
          emailProofTokenExpiresAt:
            Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: "changeRequested"
        });
        break;

      // Annule le changement de mail en attente
      case "cancelPendingChange":
        Object.assign(valuesToSet, {
          emailChangeCandidate: "",
          emailProofToken: "",
          emailProofTokenExpiresAt: 0,
          emailStatus: "confirmed"
        });
        break;

      // Sinon, rien
    }

    // MAJ la BDD
    await User.update({ id: this.req.me.id }).set(valuesToSet);

    // If this is an immediate change, and billing features are enabled,
    // then also update the billing email for this user's linked customer entry
    // in the Stripe API to make sure they receive email receipts.
    // > Note: If there was not already a Stripe customer entry for this user,
    // > then one will be set up implicitly, so we'll need to persist it to our
    // > database.  (This could happen if Stripe credentials were not configured
    // > at the time this user was originally created.)
    if (
      desiredEffectReEmail === "changeImmediately" &&
      sails.config.custom.enableBillingFeatures
    ) {
      let didNotAlreadyHaveCustomerId = !this.req.me.stripeCustomerId;
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        stripeCustomerId: this.req.me.stripeCustomerId,
        emailAddress: newEmailAddress
      });
      if (didNotAlreadyHaveCustomerId) {
        await User.update({ id: this.req.me.id }).set({
          stripeCustomerId
        });
      }
    }

    // Si un changement d'email a été demandé et une re-confirmation est requise,
    // envoyer l'email de confirmation.
    if (
      desiredEffectReEmail === "beginChange" ||
      desiredEffectReEmail === "modifyPendingChange"
    ) {
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: "Shopimax : Votre compte a été mis à jour",
        template: "email-verify-new-email",
        templateData: {
          fullName: inputs.fullName || this.req.me.fullName,
          token: valuesToSet.emailProofToken
        }
      });
    }

    return exits.success();
  }
};
