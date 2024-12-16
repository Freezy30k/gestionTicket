const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge / 1000, // JWT utilise les secondes pour expiresIn
  });
};

// inscription utilisateur
exports.register = async (req, res) => {
  const { user_name, user_email, user_password, user_role } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const emailExist = await User.findOne({ where: { user_email } });
    if (emailExist) {
      return res.status(409).json({ error: "Cet email est déjà utilisé." });
    }

    // Hacher le mot de passe de l'utilisateur
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      user_name,
      user_email,
      user_password: hashedPassword,
      user_role,
    });

    // Réponse en cas de succès
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user_id: user.user_id,
    });
  } catch (err) {
    let error = {};

    // Vérification des erreurs de validation Sequelize
    if (err.name === "SequelizeValidationError") {
      error.validation = err.errors.map((e) => e.message);
      console.error("Erreur de validation Sequelize :", err);
    }
    // Vérification des doublons (email déjà utilisé) via contrainte unique
    else if (err.name === "SequelizeUniqueConstraintError") {
      error.user_email = "Cet email est déjà utilisé";
      console.error("Erreur de contrainte unique :", err);
    }
    // Gestion des autres erreurs
    else {
      error.general = "Une erreur inattendue est survenue";
      console.error("Erreur générale :", err);
    }

    // Retourner les erreurs au client
    res.status(400).json({ error });
  }
};

// Connexion utilisateur
module.exports.login = async (req, res) => {
  const { user_email, user_password } = req.body;

  // Vérification des entrées utilisateur
  if (!user_email || !user_password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    // Rechercher l'utilisateur dans la base de donnees
    const user = await User.login(user_email, user_password);
    console.log(user_email, user_password);
    //const user = await User.findOne({ where: { user_email } });
    if (!user) {
      throw new Error("Email non trouve.");
    }

    // Verifions le mot de passe
    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect.");
    }

    // Creation du token JWT
    const token = createToken(user.user_id);

    //  cookie JWT
    res.cookie("jwt", token, {
      httpOnly: true, // Securite : empeche l'acces au cookie via JavaScript cote client
      maxAge,
      secure: process.env.NODE_ENV === "production", // Active uniquement en production
      sameSite: "Strict", // Protection CSRF
    });

    // Reponse en cas de succes
    res.status(200).json({
      message: "Connexion reussie",
      user: user.user_id,
      user: user.user_email,
      user: user.user_role,
    });
  } catch (err) {
    console.error("Erreur de connexion :", err.message);

    // Gestion des erreurs
    if (err.message === "Email non trouve") {
      return res.status(404).json({ error: "Email non trouve" });
    }
    if (err.message === "Mot de passe incorrect.") {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Erreur interne
    res.status(500).json({ error: "Erreur " });
  }
};

// admin
module.exports.adminLogin = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // verifions si l'utilisateur existe avec le rôle admin
    const admin = await User.findOne({
      where: {
        user_email,
        user_role: "admin",
      },
    });

    if (!admin) {
      return res.status(401).json({ message: "Acces non autorise." });
    }

    // Verifions le mot de passe
    const isPasswordValid = await bcrypt.compare(
      user_password,
      admin.user_password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    // JWT
    const token = createToken(admin.user_id);

    res.status(200).json({
      message: "Connexion reussie.",
      token,
    });
  } catch (err) {
    console.error("Erreur lors de la tentative de connexion :", err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
};

// agent
module.exports.agentLogin = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // verifions si l'utilisateur existe avec le rôle admin
    const agent = await User.findOne({
      where: {
        user_email,
        user_role: "agent",
      },
    });

    if (!agent) {
      return res.status(401).json({ message: "Acces non autorise." });
    }

    // Verifions le mot de passe
    const isPasswordValid = await bcrypt.compare(
      user_password,
      agent.user_password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    // Générer un jeton JWT
    const token = createToken(agent.user_id);

    res.status(200).json({
      message: "Connexion réussie.",
      token,
    });
  } catch (err) {
    console.error("Erreur lors de la tentative de connexion :", err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
};

// Deconnexion
module.exports.logOut = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
    httpOnly: true,
  });
  res.redirect("/");
};
