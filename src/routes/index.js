const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController')



// router.get("/login", kindeClient.login(), (req, res) => {
	// return res.redirect("/");
// });
// 
// router.get("/register", kindeClient.register(), (req, res) => {
	// return res.redirect("/");
// });
// 
// router.get("/callback", kindeClient.callback(), (req, res) => {
	// return res.redirect("/");
// });
// 
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/users", authController.getAllUsers);

module.exports = router;
