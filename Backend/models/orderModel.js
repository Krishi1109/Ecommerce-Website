const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            // require: true
        },
        city: {
            type: String,
            require: true
        },
        state: {
            type: String,
            // require: true
        },
        country: {
            type: String,
            // require: true
        },
        address: {
            type: String,
            // require: true
        },
        phoneNo: {
            type: Number,
            // require: true
        },
    },

    orderItem: [
        {
            name: { type: String, required: true },
            price: { type: Number, require: true },
            quantity: { type: Number, require: true },
            image: { type: String, required: true },
            product: {
                type: mongoose.Schema.objectId,
                ref: "product",
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shppingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model("Order", orderSchema)