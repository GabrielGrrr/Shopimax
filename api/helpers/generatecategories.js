module.exports = {


  friendlyName: 'Generatecategories',


  description: "Le nom est en lowercase parce que mon sdk me fait momentanément la misère avec certains noms composés de tiret",


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {


    var pdctCategories = [];
    var pdctCategorie;

    // CATEGORIES Oui, elles sont complètement pompées sur Amazon
    var Root = await ProductCategory.create({
      name: "Root",
      friendlyName: "Ensemble de toutes les catégories",
      rank: 0
    }).fetch();

    var Parent = await ProductCategory.create({
      name: "fashion",
      friendlyName: "Vêtements, Chaussures, Bijoux",
      img: '<i class="fas fa - tshirt"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "shoe",
      friendlyName: "Chaussures",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "watch",
      friendlyName: "Montres",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "handbag",
      friendlyName: "Sacs à main",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "men_mode",
      friendlyName: "Homme",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "women_mode",
      friendlyName: "Femme",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "children_mode",
      friendlyName: "Enfant",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    await ProductCategory.addToCollection(Parent.id, 'children', pdctCategories);
    var index = pdctCategories.length - 1;




    Parent = await ProductCategory.create({
      name: "literature",
      friendlyName: "Livres, e-book, livres audios",
      img: '<i class="fas fa-book"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "books",
      friendlyName: "Livres",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "ebooks",
      friendlyName: "E-books",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "audiobooks",
      friendlyName: "Livres audios",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;



    Parent = await ProductCategory.create({
      name: "medias",
      friendlyName: "Musique, DVD, Blu-Rays",
      img: '<i class="fas fa-compact-disk"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "cds",
      friendlyName: "CD & Vinyles",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "dvds",
      friendlyName: "DVD & Blu-Ray",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "series",
      friendlyName: "Séries Télévisées",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "instruments",
      friendlyName: "Instruments de musique & Sono",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;


    Parent = await ProductCategory.create({
      name: "tech",
      friendlyName: "High-Tech, Informatique, Bureau",
      img: '<i class="fas fa-desktop"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "phones",
      friendlyName: "Smartphones",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "pcs",
      friendlyName: "Ordinateurs et composants",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "tvs",
      friendlyName: "Télévision & Home cinéma",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "photo",
      friendlyName: "Photo et caméscopes",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;


    Parent = await ProductCategory.create({
      name: "gaming",
      friendlyName: "Jeux vidéo et Consoles",
      img: '<i class="fas fa-gamepad"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "playstation",
      friendlyName: "PS4",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "xbox",
      friendlyName: "Xbox One",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "nintendo",
      friendlyName: "Nintendo Touch",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;


    Parent = await ProductCategory.create({
      name: "house",
      friendlyName: "Maison, Bricolage, Animalerie",
      img: '<i class="fas fa-home"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "meubles",
      friendlyName: "Meubles",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "literie",
      friendlyName: "Literie",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "linge",
      friendlyName: "Linge de Maison",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "tools",
      friendlyName: "Outillage",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    pdctCategorie = await ProductCategory.create({
      name: "emenager",
      friendlyName: "Électro-ménager",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;

    Parent = await ProductCategory.create({
      name: "enfance",
      friendlyName: "Jouets, Enfants et Bébés",
      img: '<i class="fas fa-child"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "toys",
      friendlyName: "Jeux et jouets",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;


    Parent = await ProductCategory.create({
      name: "beauty",
      friendlyName: "Beauté, Santé, Épicerie",
      img: '<i class="fas fa-heart"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "men_beauty",
      friendlyName: "Univers Homme",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "parfums",
      friendlyName: "Parfums",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "coiffure",
      friendlyName: "Coiffure",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "maquillage",
      friendlyName: "Maquillage",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "hygiene",
      friendlyName: "Hygiène et Santé",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);



    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;


    Parent = await ProductCategory.create({
      name: "sport",
      friendlyName: "Sports et Loisirs",
      img: '<i class="fas fa-futbol"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "football",
      friendlyName: "Football",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "fitness",
      friendlyName: "Fitness",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    pdctCategorie = await ProductCategory.create({
      name: "running",
      friendlyName: "Running",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));
    index = pdctCategories.length - 1;

    Parent = await ProductCategory.create({
      name: "auto",
      friendlyName: "Auto et Moto",
      img: '<i class="fas fa-car"></i>',
      rank: 1,
      parent: Root.id,
      children: []
    }).fetch();

    pdctCategorie = await ProductCategory.create({
      name: "car",
      friendlyName: "Pièces et accessoires auto",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);


    pdctCategorie = await ProductCategory.create({
      name: "moto",
      friendlyName: "Pièces et accessoires moto",
      rank: 2,
      parent: Parent.id
    }).fetch();
    await pdctCategories.push(pdctCategorie.id);

    await ProductCategory.addToCollection(Parent.id, "children", pdctCategories.slice(index));

    // All done.
    return exits.success(pdctCategories);

  }


};

