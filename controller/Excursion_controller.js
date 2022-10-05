

const { Sequelize } = require('sequelize');
// const coustomer = require("../Schema/coustomer_schema");
// const admin = require("../Schema/admin_schema");
const Evalid = require("../middleware/EmailValidator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
var express = require("express");
var jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = require("../Models/user.model")
const Excursion = require("../Models/excursion.model");
const e = require("express");

var app = express();
dotenv.config();
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


function isLatitude(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
}

function isLongitude(lng) {
    return isFinite(lng) && Math.abs(lng) <= 180;
}


exports.createexcursion = async (req, res, next) => {
    // console.log(req.body.lat);
    // console.log(isLatitude(req.body.lat));
    if (req.body.name == "" || req.body.name == undefined) {
        res.status(400).json({ Message: "Excursion Name missing :: Enter Again" });
    } else if (req.body.city == "" || req.body.city == undefined) {
        res.status(400).json({ Message: "Excursion city missing :: Enter Again" });
    } else if (req.body.description == "" || req.body.description == undefined) {
        res.status(400).json({ Message: "Excursion description missing :: Enter Again" });
    } else if (req.body.lat == "" || req.body.lat == undefined || req.body.lng == "" || req.body.lng == undefined) {
        res.status(400).json({ Message: "Please provide both latitide and longitude.." });
    } else if (req.body.date == "" || req.body.date == undefined) {
        //it is not a date with format YYYY-MM-DD
        res.status(400).json({ Message: "Please provide Date in format YYYY-MM-DD" });
    }
    else if (req.body.date.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
        //it is not a date with format YYYY-MM-DD
        res.status(400).json({ Message: "Please provide Date in format YYYY-MM-DD" });
    }
    else if (!isLatitude(req.body.lat)) {
        res.status(400).json({ Message: "Please provide valid latitude (-90 to 90)" });
    }
    else if (!isLongitude(req.body.lng)) {
        res.status(400).json({ Message: "Please provide valid longitude. (-180 to 180)" });
    }
    else {
        await User.findOne({
            where: {
                [Op.and]: [
                    { email: req.user.email },
                    { role: "admin" }
                ]
            }
        }).then(resp => {
            if (!resp) {
                res.status(400).json({ Message: "You are not Authorized for this operation, Contact Admin" });
                return;
            } else {
                // craeting dummy point
                var point = { type: 'Point', coordinates: [req.body.lat, req.body.lng] };
                Excursion.create({
                    Name: req.body.name,
                    Date: req.body.date,
                    City: req.body.city,
                    Path: point,
                    Description: req.body.description
                }).then(response => {
                    res.json({
                        Statuscode: 200,
                        Message: "New excursion created successfully.",
                    })
                }).catch((error) => {
                    console.error(`Failed to create a new record : ${error}`);
                });

            }
        });
    }





}


exports.getexcursion = async (req, res, next) => {

    await User.findOne({
        where: {
            [Op.and]: [
                { email: req.user.email },
                { role: "admin" }
            ]
        }
    }).then(resp => {
        if (!resp) {
            res.status(400).json({ Message: "You are not Authorized for this operation, Contact Admin" });
            return;
        } else {

            const where = {};

            if (req.body.lat && req.body.lng) {
                if (!isLatitude(req.body.lat)) {
                    res.status(400).json({ Message: "Please provide valid latitude (-90 to 90)" });
                    return;
                }
                else if (!isLongitude(req.body.lng)) {
                    res.status(400).json({ Message: "Please provide valid longitude. (-180 to 180)" });
                    return;
                }

                console.log("I am valid lat and long for search")
                const myDistance = 50000; // e.g. 10 kilometres
                Excursion.findAll({
                    attributes: {
                        include: [
                            [
                                Sequelize.fn(
                                    'ST_Distance',
                                    Sequelize.col('Path'),
                                    Sequelize.fn('ST_MakePoint', req.body.lng, req.body.lat)
                                ),
                                'distance'
                            ]
                        ]
                    },
                    where: Sequelize.where(
                        Sequelize.fn(
                            'ST_DWithin',
                            Sequelize.col('Path'),
                            Sequelize.fn('ST_MakePoint', req.body.lng, req.body.lat),
                            myDistance
                        ),
                        true
                    ),
                    order: Sequelize.literal('distance ASC')
                }).then(response => {
                    res.json({
                        Statuscode: 200,
                        Message: "::Excursion Data with location parameters radius ::",
                        Data: response
                    })
                }).catch((error) => {
                    console.error(`${error}`);
                });

            }
            // else {
            //     res.status(400).json({ Message: "Please provide both Lat and Lng to search" });
            //     return;
            // }


            if (req.body.city) {
                where[Op.and] = []
                where[Op.and].push({
                    City: {
                        [Op.iLike]: `%${req.body.city}%`
                    }
                })
            }


            Excursion.findAll({ where }).then(response => {
                res.json({
                    Statuscode: 200,
                    Message: "::Excursion Data::",
                    Data: response
                })
            }).catch((error) => {
                console.error(`Failed to create a new record : ${error}`);
            });


        }
    })

}


