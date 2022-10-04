


// const coustomer = require("../Schema/coustomer_schema");
// const admin = require("../Schema/admin_schema");
const Evalid = require("../middleware/EmailValidator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
var express = require("express");
var jwt = require("jsonwebtoken");
var app = express();
dotenv.config();
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


exports.createexcursion = async (req, res, next) => {
    res.status(200).json({ Message: "I am createexcursion" });
}
exports.getexcursion = async (req, res, next) => {
    res.status(200).json({ Message: "I am getexcursion" });

}


