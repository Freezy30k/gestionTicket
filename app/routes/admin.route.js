// importer
const router = require("express").Router();
const AdminController = require("../controllers/admin.controller");
const AuthController = require("../controllers/auth.Controller");

router.post("/adminLogin", AuthController.adminLogin);

// Recuperer tous les administrateurs
router.get("/", AdminController.getAllAdmin);

//donner un role
router.post("/assignRole", AdminController.assignRole);

// Récuperer un administrateur par ID
router.get("/:id", AdminController.getAdminById);

// Mettre a jour un administrateur
router.patch("/:id", AdminController.updateAdminById);

// Supprimer un administrateur
router.delete("/:id", AdminController.deleteAdminById);

//supprimer un utilisateur par un admin
router.delete("/:id", AdminController.deleteUserByAdmin);

// obtenir statisique
router.get("/:id", AdminController.getStatistiques);

module.exports = router;
