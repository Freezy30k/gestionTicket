// importer
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
//const  index  = require("./index.model");

// model Ticket
const Ticket = sequelize.define(
  "ticket",
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },

    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "en attente",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "ticket",
  }
);

// Association
// Ticket.associate = (models) => {
//   // Un ticket appartient a un utilisateur qui l'a cree
//   Ticket.belongsTo(User.model, {
//     foreignKey: "ticket_id",
//     as: "createdTickets",
//   });

//   // Un ticket peut etre assigne a un agent
//   Ticket.belongsTo(User.model, {
//     foreignKey: "agent_id",
//     as: "assignedAgent",
//   });
// };

// synchronisation
(async () => {
  try {
    await sequelize.authenticate();
    //console.log("Connexion reussie a la base de donnees.");

    await sequelize.sync({ force: false });
    console.log("Table Ticket synchronisée avec succes.");
  } catch (err) {
    console.error(
      "Erreur lors de la connexion ou de la synchronisation :",
      err
    );
  }
})();

module.exports = Ticket;
