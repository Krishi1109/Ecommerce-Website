const Order = require("../models/orderModel")
const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncError')

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { 
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        texPrice,
        shippingPrice,
        totalPrice } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        texPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})
