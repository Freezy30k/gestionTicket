// importer
const user = require("../models/user.model");

module.exports.getAllUsers = async (req, res) => {
  try {
    // Récuperation des utilisateurs sans le champ user_password
    const users = await user.findAll({
      attributes: { exclude: ["user_password"] },
    });

    // Vérification des utilisateur dans la bd
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouve." });
    }

    //  utilisateurs trouves
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la recuperation des utilisateurs :", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la recuperation des utilisateurs." });
  }
};

// information utilisateur
module.exports.userInfo = async (req, res) => {
  try {
    const user_id = parseInt(req.params.id, 10);

    // Vérification de la validité de l'ID
    if (!user_id || isNaN(user_id)) {
      return res.status(400).send("ID invalide : " + user_id);
    }

    // Verifions si l'utilisateur est autorise à voir ces informations
    if (req.user.id !== parseInt(user_id)) {
      return res.status(403).json({ message: "Acces interdit." });
    }

    // Recuperation des informations de l'utilisateur sans le mot de passe
    const user = await user.findByPk(user_id, {
      attributes: { exclude: ["user_password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(
      "Erreur lors de la recuperation des informations utilisateur :",
      err
    );
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// mise a jour utilisateur
module.exports.updateUser = async (req, res) => {
  try {
    const user_id = parseInt(req.params.id, 10);

    // Vérification de l'ID
    if (!user_id || isNaN(user_id) || user_id <= 0) {
      return res.status(400).json({ message: "ID invalide : " + user_id });
    }

    // Mise a jour des donnees utilisateur
    const [updatedRowCount, updatedRows] = await user.update(
      { bio: req.body.bio, name: req.body.name, email: req.body.email },
      {
        where: { id: user_id },
        returning: true, // Retourner les donnees mises a jour
      }
    );

    // Si aucune ligne n'a ete mise a jour
    if (updatedRowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouve." });
    }

    // Repondre avec les donnees de l'utilisateur mis a jour
    res.status(200).json({
      message: "Utilisateur mis a jour avec succes.",
      user: updatedRows, // Utilisateur mis a jour
    });
  } catch (err) {
    console.error("Erreur lors de la mise a jour de l'utilisateur :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// suppression de l'utilisateur
// module.exports.deleteUser = async (req, res) => {
//   try {
//     const user_id = req.params.id;

//     // Vérification de la validité de l'ID
//     if (!user_id || isNaN(user_id)) {
//       return res.status(400).send("ID inconnu : " + user_id);
//     }

//     const deletedRowCount = await User.destroy({
//       where: { id: user_id }, // Condition sur l'ID
//     });

//     if (deletedRowCount === 0) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     res.status(200).json({ message: "Utilisateur supprimé avec succès" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erreur serveur." });
//   }
// };
