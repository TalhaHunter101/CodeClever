const express = require("express");
const router = express.Router();
const userController = require("../controller/user_controller");
const ExcursionController = require("../controller/Excursion_controller");

const auth = require("../middleware/auth");
router.use(
    express.urlencoded({
        extended: true,
    })
);
// generating token
//routing User Controller

router.post("/user/signup", userController.signup);
router.post("/user/login", userController.login);

//routing the excursion controllers

router.post("/excursion/createexcursion", auth, ExcursionController.createexcursion);
router.get("/excursion/getexcursion", auth, ExcursionController.getexcursion);

module.exports = router;