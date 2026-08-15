
require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const path=require('path')
const fileUpload = require('express-fileupload');
const router = require("./routes/index");

const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'static')))
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
start();

// const mongoose = require("mongoose");