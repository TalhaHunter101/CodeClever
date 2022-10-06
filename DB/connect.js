const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env.DB_Password);

const sequelize = new Sequelize(
  process.env.DB_Name,
  process.env.DB_owner,
  process.env.DB_Password,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to postgres database has been established successfully."
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;
