const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../DB/connect");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("User table initied successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table User : ", error);
  });

module.exports = User;
