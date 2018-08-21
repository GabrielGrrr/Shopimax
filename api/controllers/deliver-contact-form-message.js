module.exports = {
  friendlyName: "Envoie un formulaire de contact",

  description:
    "Envoie un formulaire de contact aux canaux internes appropriés.",

  inputs: {
    emailAddress: {
      required: true,
      type: "string",
      description: "Une adresse mail retour à laquelle on peut répondre.",
      example: "pamela@harvard.edu"
    },

    topic: {
      required: true,
      type: "string",
      description: "Le sujet du formulaire de contact.",
      example: "I want to buy stuff."
    },

    fullName: {
      required: true,
      type: "string",
      description: "Le nom complet de la personne envoyant ce formulaire.",
      example: "Pamela Pop"
    },

    message: {
      required: true,
      type: "string",
      description: "Le message, plain text."
    }
  },

  exits: {
    success: {
      description: "Le message a été envoyé avec succès."
    }
  },

  fn: async function(inputs, exits) {
    if (!sails.config.custom.internalEmailAddress) {
      throw new Error(
        `Impossible de recevoir le message provenant du formulaire car aucune adresse interne
        (\`sails.config.custom.internalEmailAddress\`) n'a été définie.  
        Pour permettre les mails depuis le formulaire de contact, vous devez autoriser cette option
         -- généralement dans \`config/custom.js\`, \`config/staging.js\`,
\`config/production.js\`, ou via les variables d'environnement système.`
      );
    }

    await sails.helpers.sendTemplateEmail.with({
      to: sails.config.custom.internalEmailAddress,
      subject: "Nouveau message par formulaire de contact",
      template: "internal/email-contact-form",
      layout: false,
      templateData: {
        contactName: inputs.fullName,
        contactEmail: inputs.emailAddress,
        topic: inputs.topic,
        message: inputs.message
      }
    });

    return exits.success();
  }
};
