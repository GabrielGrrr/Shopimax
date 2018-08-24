module.exports = {


  friendlyName: 'Generatevariations',


  description: 'Generatevariations something.',


  inputs: {

  },


  exits: {

  },

  fn: async function (inputs, exits) {
    var pdctVariations = [];
    var pdctVariation;
    var varValues = [];
    var varValue;

    pdctVariation = await ProductVariation.create({
      name: "clotheSize",
      friendlyName: "Taille",
    }).fetch();
    pdctVariations.push(pdctVariation.id);

    varValue = await VariationValue.create({
      name: "XXS",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "XS",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "S",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "M",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "L",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "XL",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "2XL",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "3XL",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "4XL",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    varValue = await VariationValue.create({
      name: "5XL",
      variation: pdctVariation.id,
    }).fetch();
    varValues.push(varValue.id);

    await ProductVariation.addToCollection(pdctVariation.id, 'values', varValues);

    // All done.
    return exits.success({ variations: pdctVariations, values: varValues });

  }


};

