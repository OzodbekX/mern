const sequelize = require("./db");
require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const PORT = process.env.PORT || 5000;
const app = express();
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