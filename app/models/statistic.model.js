// importer
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Role = require("./role.model");
const Ticket = require("./tickets.model");

const Statistic = sequelize.define("statistic", {
  stat_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  total_tickets: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pending_tickets: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  inProgress_tickets: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  resolved_tickets: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_user: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timestamps: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Statistic.associate = (models) => {
  Statistic.belongsTo(Role.model, {
    foreignKey: "role_id",
    as: "role",
  });

  Statistic.belongsTo(Ticket.model, {
    foreignKey: "ticket_id",
    as: "ticket",
  });
};

// synchronisation
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Table statistic synchronisée avec succes.");
  } catch (err) {
    console.error(
      "Erreur lors de la connexion ou de la synchronisation :",
      err
    );
  }
})();

module.exports = Statistic;
