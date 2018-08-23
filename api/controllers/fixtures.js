module.exports = {
  friendlyName: "Fixtures",

  description: "Fixtures something.",

  inputs: {},

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "La fixture ne fonctionne pas.",
      extendedDescription:
        " Avez-vous bien installé le module faker ? npm install faker et c'est réglé ! ;) Assurez-vous d'avoir bien défini un adapter approprié à votre SGBD. Sinon, allez jeter un oeil dans controllers/fixtures.js."
    }
  },

  fn: async function (inputs, exits) {
    var countries = await sails.helpers.countrylist();

    var faker = await require("faker");
    var nbUsers = 100;
    var nbProducts = 250;
    var nbAvgComment = 25;

    sails.log(
      "On entame les fixtures, avec un nombre d'utilisateurs de " +
      nbUsers +
      ", un nombre de produits de " +
      nbProducts +
      ", un nombre de commentaires moyens de " +
      nbAvgComment
    );
    var addresses = [];
    var address;

    var buyers = [];
    var buyer;

    // ADRESSES
    sails.log("Generating addresses ...");
    for (i = 0; i < nbUsers; i++) {
      address = await Address.create({
        country:
          countries[await Math.floor((await Math.random()) * countries.length)],
        area: await faker.address.state(),
        city: await faker.address.city(),
        address: await faker.address.streetAddress(),
        additionnalAddress: await faker.address.secondaryAddress(),
        postalCode: await faker.address.zipCode(),
        phoneNumber: await faker.phone.phoneNumber()
      }).fetch();
      addresses.push(address.id);
    }

    // ACHETEURS
    sails.log("Generating users ...");
    for (i = 0; i < nbUsers; i++) {
      buyer = await User.create({
        emailAddress: await faker.internet.email(),
        /*password: await sails.helpers.passwords.hashPassword(
          faker.internet.password()
        ),*/
        password: await faker.internet.password(),
        fullName: await faker.name.findName(),
        tosAcceptedByIp: await faker.internet.ip(),
        address: addresses[i]
      }).fetch();
      buyers.push(buyer.id);
    }
    /*
    // ACHETEURS
    sails.log("Generating users ...");
    for (i = 0; i < nbSellers; i++) {
      seller = await Seller.create({
        emailAddress: await faker.internet.email(),
        password: await sails.helpers.passwords.hashPassword(
          faker.internet.password()
        ),
        fullName: await faker.name.findName(),
        tosAcceptedByIp: await faker.internet.ip(),
        address: addresses[i]
      }).fetch();
      buyers.push(buyer.id);
    }*/

    sails.log(buyers);
    return exits.success();
  }
};
