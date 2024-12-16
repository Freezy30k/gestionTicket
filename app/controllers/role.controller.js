// const { User } = require("../models");

// module.exports.setAdmin = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user)
//       return res.status(404).json({ message: "Utilisateur introuvable" });

//     user.role = "admin";
//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Utilisateur mis à jour en administrateur", user });
//   } catch (err) {
//     console.error("Erreur lors de la mise à jour du rôle :", err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };

// module.exports.assignRole = async (req, res) => {
//   try {
//     const { user_id, role } = req.body;
//     const user = await User.findByPk(user_id);
//     if (!user)
//       return res.status(404).json({ message: "Utilisateur introuvable" });

//     user.role = role;
//     await user.save();

//     res
//       .status(200)
//       .json({ message: `Role de l'utilisateur mis a jour en ${role}`, user });
//   } catch (err) {
//     console.error("Erreur lors de l'attribution du role :", err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// };
