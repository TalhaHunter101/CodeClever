const Evalid = require("../middleware/EmailValidator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
var express = require("express");
var jwt = require("jsonwebtoken");

// const sequelize = require("../DB/connect")

const User = require("../Models/user.model");

// const { send } = require("process");
// const { response } = require("express");
var app = express();
dotenv.config();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

exports.signup = async function (req, res) {
  if (req.body.name == "" || req.body.name == undefined) {
    res.status(400).json({ Message: "Missing Name: try Again" });
    return;
  } else if (req.body.email == "" || req.body.email == undefined) {
    res.status(400).json({ Message: "Missing Email:: Try again" });
    return;
  } else if (req.body.password == "" || req.body.password == undefined) {
    res.status(400).json({ Message: "Missing Password:: Try again" });
    return;
  } else if (req.body.password.length < 6) {
    res
      .status(411)
      .json({ Message: "Password should be at least 6 characters" });
    return;
  } else if (Evalid.validateEmailAddress(req.body.email) === -1) {
    res.status(400).json({ Message: "Incorrect email :: Enter again" });
    return;
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    // console.log(hashPass)
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((resp) => {
        if (!resp) {
          //   console.log(req.body);
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            role: "user",
          })
            .then((response) => {
              // console.log(response)
              const token = jwt.sign(
                { email: req.body.email },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: "5h",
                }
              );
              res.json({
                Statuscode: 200,
                Message: "You are registered. --- Thanks",
                Token: token,
              });
            })
            .catch((error) => {
              console.error(`Failed to create a new record : ${error}`);
            });
        } else {
          res.json({ Message: "Your email already registered" });
        }
        // console.log(res)
      })
      .catch((error) => {
        console.error("Failed to retrieve data : ", error);
      });
  }
};

exports.login = async function (req, res) {
  // console.log(req.body);
  if (req.body.email == "" || req.body.email == undefined) {
    res.status(400).json({ Message: "Missing Email:: Try again" });
    return;
  } else if (req.body.password == "" || req.body.password == undefined) {
    res.status(400).json({ Message: "Missing Password:: Try again" });
    return;
  } else if (req.body.password.length < 6) {
    res
      .status(411)
      .json({ Message: "Password should be at least 6 characters" });
    return;
  } else if (Evalid.validateEmailAddress(req.body.email) === -1) {
    res.status(400).json({ Message: "Incorrect email :: Enter again" });
    return;
  } else {
    await User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((resp) => {
      if (!resp) {
        res
          .status(400)
          .json({ Message: "You are not registerd, Signup First." });
        return;
      } else {
        const validPassword = bcrypt.compare(req.body.password, resp.password);

        if (validPassword) {
          const token = jwt.sign(
            { email: req.body.email },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "5h",
            }
          );
          res.status(200).json({
            message: `Welcome :: ${resp.name}, You are loged in.`,
            Token: token,
          });
        } else {
          res.status(400).json({ error: "Invalid Credentials" });
        }
      }
    });
  }
};
