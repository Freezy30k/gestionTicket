// Importer les modèles et la base de données
const sequelize = require("../config/db");
const User = require("./user.model");
const Role = require("./role.model");
const Ticket = require("./tickets.model");

// Associations
// Un rôle peut etre associé à plusieurs utilisateurs
Role.hasMany(User, { foreignKey: "role_id", as: "users" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

// Un utilisateur peut créer plusieurs tickets
User.hasMany(Ticket, { foreignKey: "created_by", as: "createdTickets" });
Ticket.belongsTo(User, { foreignKey: "created_by", as: "creator" });

// Un utilisateur (agent) peut etre assige a plusieurs tickets
User.hasMany(Ticket, { foreignKey: "agent_id", as: "assignedTickets" });
Ticket.belongsTo(User, { foreignKey: "agent_id", as: "assignedAgent" });

module.exports = {
  sequelize,
  User,
  Role,
  Ticket,
};
