const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
//const Role = require("./role.model");
//const Ticket = require("./tickets.model");
//const Index = require("./index.model");
const bcrypt = require("bcrypt");

// Modèle User
const User = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom d'utilisateur ne peut pas etre vide" },
        len: {
          args: [3, 100],
          msg: "Le nom d'utilisateur doit contenir entre 3 et 100 caracteres",
        },
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
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: "Le mot de passe doit contenir au moins 8 caracteres",
        },
      },
    },
    user_role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

// Associations
// User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
// User.hasMany(Ticket, { foreignKey: "ticket_id", as: "createdTickets" });
// User.hasMany(Ticket, { foreignKey: "agent_id", as: "assignedTickets" });

// Méthode de connexion
User.login = async function (user_email, user_password) {
  try {
    if (!user_email || !user_password)
      throw new Error("L'email et le mot de passe sont requis.");
    const user = await User.findOne({ where: { user_email } });
    if (!user) throw new Error("Email non trouve.");
    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!isPasswordValid) throw new Error("Mot de passe incorrect.");
    return user;
  } catch (err) {
    console.error("Erreur lors de la connexion :", err.message);
    throw err;
  }
};

// Synchronisation
(async () => {
  try {
    await sequelize.authenticate();
    //console.log("Connexion reussie a la base de donnees.");
    await sequelize.sync({ alter: true });
    console.log("Table User synchronisée avec succes.");
  } catch (err) {
    console.error("Erreur lors de la synchronisation de la table User :", err);
  }
})();

module.exports = User;
