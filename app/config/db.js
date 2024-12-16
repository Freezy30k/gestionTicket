// importer
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configurons la connexion a la base de donnees
const sequelize = new Sequelize(
  process.env.DB_NAME,
  "postgres",
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",

    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion réussie a la base de donnees");
  } catch (err) {
    console.error("Erreur de connexion :", err);
    process.exit(1);
  }
})();

module.exports = sequelize;
