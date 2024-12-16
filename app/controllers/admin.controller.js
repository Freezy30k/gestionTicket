//importer
const Ticket = require("../models/tickets.model");
const User = require("../models/user.model");

module.exports.getAllAdmin = async (req, res) => {
  try {
    // Recuperons les admins sans les mots de passes
    const admins = await User.findAll({
      where: { user_role: "admin" },
      attributes: { exclude: ["user_password"] },
    });

    // Verifions si des administrateurs ont ete trouves
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "Aucun administrateur trouve." });
    }

    // Administrateurs trouves
    res.status(200).json(admins);
  } catch (err) {
    console.error("Erreur lors de la récupération des administrateurs :", err);
    res.status(500).json({
      error: "Erreur lors de la recuperation des administrateurs.",
    });
  }
};

module.exports.getAdminById = async (req, res) => {
  try {
    const admin_id = parseInt(req.params.id, 10);

    //on recherche l'id et on verifi le role
    const admin = await User.findOne({
      where: {
        user_id: admin_id,
        user_role: "admin",
      },
      attributes: { exclude: ["user_password"] },
    });

    // Vérifions si l'administrateur a ete trouve
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouve." });
    }

    // Administrateur trouve
    res.status(200).json(admin);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'administrateur :", err);
    res.status(500).json({
      error: "Erreur lors de la récupération de l'administrateur.",
    });
  }
};

module.exports.updateAdminById = async (req, res) => {
  try {
    const admin_id = parseInt(req.params.id, 10);
    const { user_name, user_email, user_role } = req.body;

    // Verifions que l'utilisateur est un administrateur
    const admin = await User.findOne({
      where: {
        user_id: admin_id,
        user_role: "admin",
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé." });
    }

    // Mise a jour des informations de l'administrateur
    await admin.update({
      user_name: user_name || admin.user_name,
      user_email: user_email || admin.user_email,
      user_role: user_role || admin.user_role,
    });

    res.status(200).json({
      message: "Informations de l'administrateur mises a jour avec succes.",
      admin,
    });
  } catch (err) {
    console.error("Erreur lors de la mise a jour de l'administrateur :", err);
    res.status(500).json({
      error: "Erreur lors de la mise a jour de l'administrateur.",
    });
  }
};

module.exports.assignRole = async (req, res) => {
  // Recuperons l'email depuis les parametres
  const user_email = req.params;

  // Recuperons le role depuis le corps de la requete
  const user_role = req.body;

  try {
    // Verifions que le role est fourni
    if (!user_role) {
      return res.status(400).json({ message: "Le role est requis." });
    }

    // Recherchons de l'utilisateur par email
    const userRecord = await User.findOne({ where: { email: user_email } });

    // Verifions si l'utilisateur existe
    if (!userRecord) {
      return res.status(404).json({ message: "Utilisateur non trouve." });
    }

    // Mise a jour du role de l'utilisateur
    await userRecord.update({ role: user_role });

    return res.status(200).json({
      message: `Rôle '${user_role}' attribue a l'utilisateur '${userRecord.email}'.`,
    });
  } catch (err) {
    console.error("Erreur lors de l'attribution du role :", err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de l'attribution du role.",
      error: err.message,
    });
  }
};

module.exports.deleteAdminById = async (req, res) => {
  try {
    const admin_id = parseInt(req.params.id, 10);

    // Verifions si l'utilisateur est un administrateur
    const admin = await User.findOne({
      where: {
        user_id: admin_id,
        user_role: "admin",
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouve." });
    }

    // Suppression de l'administrateur
    await admin.destroy();

    res.status(200).json({
      message: `Administrateur avec l'ID ${admin_id} supprimé avec succes.`,
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'administrateur :", err);
    res.status(500).json({
      error: "Erreur lors de la suppression de l'administrateur.",
    });
  }
};

module.exports.deleteUserByAdmin = async (req, res) => {
  try {
    const admin_id = parseInt(req.params.id, 10);
    const userIdToDelete = req.params.id;

    // Verifions si l'utilisateur connecte est un administrateur
    const admin = await User.findOne({
      where: {
        user_id: admin_id,
        user_role: "admin",
      },
    });

    if (!admin) {
      return res
        .status(403)
        .json({ message: "Acces refuse. Vous n'etes pas administrateur." });
    }

    // Verifions que l'utilisateur a supprimer existe
    const user = await User.findOne({
      where: {
        user_id: userIdToDelete,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve." });
    }

    // Supprimer l'utilisateur
    await user.destroy();

    res.status(200).json({
      message: `Utilisateur avec l'ID ${userIdToDelete} supprimé avec succes.`,
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur :", err);
    res.status(500).json({
      error: "Erreur serveur lors de la suppression de l'utilisateur.",
    });
  }
};
