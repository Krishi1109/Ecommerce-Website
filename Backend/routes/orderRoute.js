const express = require("express")
const { newOrder } = require("../controller/orderController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser ,newOrder)

module.exports = router