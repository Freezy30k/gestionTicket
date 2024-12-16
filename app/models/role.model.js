// Importer
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const User = require("./user.model");
// const Index = require("./index.model");

// Modele Role
const Role = sequelize.define(
  "role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "unique_user_email", msg: "Cet email est déjà utilise" },
      validate: {
        isEmail: { msg: "L'adresse email n'est pas valide" },
      },
    },
    role_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false, // admin agent user
    },
  },
  {
    timestamps: true,
    tableName: "role",
  }
);

// Verifions que User est bien un modele Sequelize.
// if (User && User.associate) {
//   // Association entre Role et User
//   Role.hasMany(User, {
//     foreignKey: "role_id",
//     as: "users",
//   });
// }

// Synchronisation de la table
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion reussie a la base de donnees.");

    await sequelize.sync({ alter: true });
    console.log("Table Role synchronisee avec succes.");
  } catch (err) {
    console.error("Erreur lors de la synchronisation de la table Role :", err);
  }
})();

module.exports = Role;
