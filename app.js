const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

require("dotenv").config();
require("./src/model/index");
const routes = require("./src/route/index");
const swaggerDocs = require("./src/utils/Swagger");
const errorHandler = require("./src/utils/error-handler");
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

swaggerDocs(app, port);
