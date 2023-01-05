const FormulaireModel = require("../models/formulaire.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.new = async (req, res) => {
  const { title, enabled, description, fields, categories, label, menu } =
    req.body;

  if (
    !req.body.title ||
    !req.body.enabled ||
    !req.body.description ||
    !req.body.fields ||
    !req.body.categories ||
    !req.body.label ||
    !req.body.menu
  ) {
    res.status(400).send({ message: "data can not be null!" });
    return;
  }
  try {
    const form = await FormulaireModel.create({
      title,
      enabled,
      description,
      fields,
      categories,
      label,
      menu,
    });
    res.status(201).json({ form: form._id });
  } catch (err) {
    res.status(500).send({ err });
  }
};

module.exports.getAll = async (req, res) => {
  // pour ne pas envyer le passwor on met .select('-password');
  // pour retourner tout .select();
  const forms = await FormulaireModel.find();
  res.status(200).json(forms);
};

module.exports.info = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("id unknow : " + req.params.id);

  FormulaireModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown" + err);
  });
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await FormulaireModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "succesfully deletec. " });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Update a Formulaire by the id in the request
module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("id unknow : " + req.params.id);

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  if (!req.body.title) {
    res.status(400).send({ message: "title can not be empty!" });
    return;
  }
  if (!req.body.description) {
    res.status(400).send({ message: "description can not be empty!" });
    return;
  }
  if (!req.body.fields) {
    res.status(400).send({ message: "fields can not be empty!" });
    return;
  }
  if (!req.body.categories) {
    res.status(400).send({ message: "categories can not be empty!" });
    return;
  }

  await FormulaireModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        label: req.body.label,
        description: req.body.description,
        menu: req.body.menu,
        fields: req.body.fields,
        categories: req.body.categories,
        enabled: req.body.enabled,
        logo: req.body.logo,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Formulaire with id=${req.params.id}. Maybe Formulaire was not found!`,
        });
      } else res.send({ message: "Formulaire was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

//create new formualire
module.exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "title can not be empty!" });
    return;
  }
  if (!req.body.description) {
    res.status(400).send({ message: "description can not be empty!" });
    return;
  }
  if (!req.body.fields) {
    res.status(400).send({ message: "fields can not be empty!" });
    return;
  }
  if (!req.body.categories) {
    res.status(400).send({ message: "categories can not be empty!" });
    return;
  }
  if (!req.body.label) {
    res.status(400).send({ message: "label can not be empty!" });
    return;
  }
  // Create a Formulaire
  const formulaire = new FormulaireModel({
    title: req.body.title,
    enabled: req.body.enabled,
    description: req.body.description,
    fields: req.body.fields,
    categories: req.body.categories,
    label: req.body.label,
    menu: req.body.menu,
  });

  // Save Formulaire in the database
  formulaire
    .save(formulaire)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Formulaire.",
      });
    });
};

// Delete all Formulaires from the database.
module.exports.deleteAll = (req, res) => {
  FormulaireModel.deleteMany({})
    .then((data) => {
      res.status(200).send({
        message: `${data.deletedCount} Formulaires were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all formulaires.",
      });
    });
};

//find one by title
module.exports.findByTitle = (req, res) => {
  if (!req.params.title) {
    res.status(400).send({ message: "title can not be empty!" });
    return;
  }
  FormulaireModel.findOne({ title: req.params.title })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Not found formulaire with title " + req.params.title,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving formulaire with title=" + req.params.title,
      });
    });
};

module.exports.updateLogo = async (req, res) => {
  if (!ObjectID.isValid(req.body.id))
    return res.status(400).send("id unknow : " + req.body.id);

  await FormulaireModel.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        logo: req.body.logo,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Formulaire with id=${req.body.id}. Maybe Formulaire was not found!`,
        });
      } else res.status(200).send(data);
    })
    .catch((err) => {
      res.status(200).send({
        message: err,
      });
    });
};

module.exports.menu = async (req, res) => {
  console.log("menu");
  const forms = await FormulaireModel.find({
    title: { $nin: ["login", "inscription"] },
  });
  res.status(200).json(forms);
};
