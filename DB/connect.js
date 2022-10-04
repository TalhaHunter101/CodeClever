const Sequelize = require("sequelize");
const config = process.env;
const sequelize = new Sequelize(
    'test2',
    'postgres',
    'welcome',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

// sequelize.authenticate().then(() => {
//     console.log('Connection to postgres database has been established successfully.');
// }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
// });


module.exports = sequelize;