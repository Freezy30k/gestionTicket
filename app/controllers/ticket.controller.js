//importe
const Ticket = require("../models/tickets.model.js");

module.exports.readTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports.createTicket = async (req, res) => {
  try {
    // Validation des donnees d'entree
    const { title, description, user_id } = req.body;
    if (!title || !user_id) {
      return res.status(400).json({
        message: "Le champ 'title' et 'user_id' sont obligatoires.",
      });
    }

    // Creation du ticket
    const newTicket = await Ticket.create({
      title,
      description: description || null,
      user_id,
    });

    res.status(201).json({
      message: "Ticket cree avec succes.",
      ticket: newTicket,
    });
  } catch (err) {
    console.error("Erreur lors de la creation du ticket :", err);
    res.status(500).json({
      message: "Erreur serveur lors de la creation du ticket.",
      error: err.message,
    });
  }
};

module.exports.updateTicket = async (req, res) => {
  try {
    const ticket_id = req.params.id;

    // Verifions si l'ID est valide
    if (!ticket_id || isNaN(ticket_id) || ticket_id <= 0) {
      return res.status(400).json({ message: "ID invalide : " + ticket_id });
    }

    // Mise a jour du ticket
    const [updatedRowCount, updatedRows] = await Ticket.update(
      {
        title: req.body.title,
        description: req.body.description,
      },
      {
        where: { Ticket_id: ticket_id },
        returning: true,
      }
    );

    // Si aucun ticket n'a ete mis a jour
    if (updatedRowCount === 0) {
      return res.status(404).json({ message: "Ticket introuvable" });
    }

    // Retourner le ticket mis a jour
    res.status(200).json({
      message: "Ticket mis à jour avec succes.",
      ticket: updatedRows, // Retourne le premier ticket mis a jour
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du ticket :", err);
    res
      .status(500)
      .json({ err: "Erreur serveur lors de la mise a jour du ticket." });
  }
};

module.exports.deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.destroy({
      where: { ticket_id: req.params.id },
    });

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket introuvable" });
    }

    res.status(200).json({ message: "Ticket supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du ticket:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports.commentTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket introuvable" });

    ticket.comments = [
      ...(ticket.comments || []),
      {
        commenterId: req.body.commenterId,
        commenterPseudo: req.body.commenterPseudo,
        text: req.body.text,
        timestamp: new Date().toISOString(),
      },
    ];
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un commentaire:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports.deleteCommentTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket introuvable" });

    ticket.comments = (ticket.comments || []).filter(
      (comment) => comment.id !== req.body.commentId
    );
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
