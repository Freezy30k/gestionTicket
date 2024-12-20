// importer
const express = require("express");
require("./app/config/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const UserRoute = require("./app/routes/user.route");
const TicketRoute = require("./app/routes/ticket.route");
const AdminRoute = require("./app/routes/admin.route");
const AgentRoute = require("./app/routes/agent.route");
// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
const port = 5000;
//const {version}  = require("validator");

const app = express();

//configuration body-parser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// configurer routes
app.get("/", (req, res) => {
  res.status(200);
  res.setHeader("content-type", "text/html");
});

app.use("/api/", UserRoute);
app.use("/ticket/", TicketRoute);
app.use("/admin/", AdminRoute);
app.use("/agent/", AgentRoute);

//pour afficher le server
app.listen(port, () => {
  console.log("le server s'affiche sur:" + port);
});
