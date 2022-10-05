const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = require("../DB/connect")

const Excursion = sequelize.define('Excursion', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    City: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Path: {
        type: DataTypes.GEOMETRY
    },
    Description: {
        type: DataTypes.STRING
    }

});

sequelize.sync().then(() => {
    console.log('Excursion table initied successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = Excursion;
