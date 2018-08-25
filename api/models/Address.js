/**
 * Address.js
 *
 * @description :: FR : Une adresse, référençant pays, région, ville, adresse et complément d'adresse, et code postal
 * EN : An address, containing country, area, city, address (street, postal adress), additionnal address (bloc, building ...)
 * and postal code.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    country: {
      type: "string",
      required: true,
      description: "Pays d'exercice d'activité du vendeur"
    },
    area: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "État/Province/Région",
      example: "Occitanie"
    },
    city: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Ville",
      example: "Bombay"
    },
    address: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Adresse postale / Boîte postale",
      example: "221B Baker Street"
    },
    additionnalAddress: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Complément d'adresse",
      example: "Appartement B, 2ème étage etc."
    },
    postalCode: {
      type: "string",
      required: false,
      maxLength: 120,
      description: "Code Postal",
      example: "34090"
    },
    phoneNumber: {
      type: "string",
      required: true,
      maxLength: 50
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  }
};
