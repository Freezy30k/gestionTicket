// importer
const User = require("../models/user.model");
const Ticket = require("../models/tickets.model");

module.exports.getAllAgent = async (req, res) => {
  try {
    // Recuperons les agents sans les mots de passes
    const agents = await User.findAll({
      where: { user_role: "agent" },
      attributes: { exclude: ["user_password"] },
    });

    // Verifions si des agents ont ete trouves
    if (!agents || agents.length === 0) {
      return res.status(404).json({ message: "Aucun agent trouve." });
    }

    // Agents trouves
    res.status(200).json(agents);
  } catch (err) {
    console.error("Erreur lors de la recuperation des agents :", err);
    res.status(500).json({
      error: "Erreur lors de la recuperation des agents.",
    });
  }
};

module.exports.agentInfo = async (req, res) => {
  try {
    const user_id = req.params.id;

    // Verification de la validite de l'ID
    if (!user_id || isNaN(user_id)) {
      return res.status(400).send("ID invalide : " + user_id);
    }

    // Verification des permissions de l'utilisateur connecte
    if (req.user.role === "user" && req.user.id !== parseInt(user_id)) {
      return res.status(403).json({ message: "Accès interdit." });
    }

    // Recuperation des informations utilisateur sans le mot de passe
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur :",
      err
    );
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports.updateAgent = async (req, res) => {
  try {
    const user_id = req.params.id;

    // Verification de l'ID
    if (!user_id || isNaN(user_id) || user_id <= 0) {
      return res.status(400).json({ message: "ID invalide : " + user_id });
    }

    // Mise a jour des informations utilisateur
    const [updatedRowCount, updatedRows] = await User.update(
      {
        bio: req.body.bio,
        name: req.body.name,
        email: req.body.email,
      },
      {
        where: { id: user_id },
        returning: true,
      }
    );

    // Verification si l'utilisateur existe
    if (updatedRowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouve." });
    }

    // Réponse avec les données mises à jour
    res.status(200).json({
      message: "Utilisateur mis a jour avec succes.",
      user: updatedRows[0],
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

module.exports.getAllTicket = async (req, res) => {
  try {
    // Verification si l'utilisateur connecté est un agent
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message:
          "Acces interdit : vous n'etes pas autorise a consulter les tickets.",
      });
    }

    // Recuperation de tous les tickets
    const tickets = await Ticket.findAll();

    // Verification s'il y a des tickets
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "Aucun ticket trouve." });
    }

    // Reponse avec la liste des tickets
    res.status(200).json(tickets);
  } catch (err) {
    console.error("Erreur lors de la récupération des tickets :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports.getAllTicketById = async (req, res) => {
  try {
    const ticket_id = req.params.id;

    // Verification si l'utilisateur connecte est un agent
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message:
          "Acces interdit : vous n'êtes pas autorise a consulter ce ticket.",
      });
    }

    // Vérification de l'ID
    if (!ticket_id || isNaN(ticket_id)) {
      return res.status(400).json({ message: "ID invalide : " + ticket_id });
    }

    // Recuperation du ticket par ID
    const ticket = await Ticket.findByPk(ticket_id);

    // Verification si le ticket existe
    if (!ticket) {
      return res.status(404).json({ message: "Ticket introuvable." });
    }

    // Reponse avec le ticket trouve
    res.status(200).json(ticket);
  } catch (err) {
    console.error("Erreur lors de la recuperation du ticket :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket_id = req.params.id;
    const { status } = req.body;

    // Verification si l'utilisateur connecté est un agent
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message:
          "Accès interdit : vous n'êtes pas autorisé à modifier ce ticket.",
      });
    }

    // Vérification de l'ID
    if (!ticket_id || isNaN(ticket_id)) {
      return res.status(400).json({ message: "ID invalide : " + ticket_id });
    }

    // Verification des données du statut
    const validStatuses = ["en attente", "en cours", "résolu"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Statut invalide. Statuts valides : en attente, en cours, résolu",
      });
    }

    // Mise a jour du statut du ticket
    const [updatedRowCount, updatedRows] = await Ticket.update(
      { status },
      {
        where: { id: ticket_id },
        returning: true,
      }
    );

    // Verification si le ticket a ete mis a jour
    if (updatedRowCount === 0) {
      return res.status(404).json({ message: "Ticket introuvable." });
    }

    res.status(200).json({
      message: "Statut du ticket mis a jour avec succes.",
      ticket: updatedRows[0],
    });
  } catch (err) {
    console.error("Erreur lors de la mise a jour du statut du ticket :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
