const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncError')
const User = require("../models/userModel")
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password,
        avtar: {
            public_id: "This is a sample id",
            url: "profilepictureurl"
        }
    })
    sendToken(user, 201, res)
})

// Login User 
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    // check if user has given password and email both
    if (!email && !password) {
        return next(new ErrorHandler("Please Enter Email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password okkk", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendToken(user, 200, res)

})

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("User not Found", 404))
    }

    // Get Resetpassword Token
    const resetToken = user.getResetPasswordToken()


    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your Password Reset Token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token Hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400))
    }

    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }


    user.password = req.body.password;
    user.resetPasswordToken = undefined,
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
})

// Get user details
exports.getUserDetails = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id)


    res.status(200).json({
        success : true,
        user
    })
})

// Update Password
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }

    user.password = req.body.newPassword

    await user.save()

    sendToken(user, 200, res)
})

// Update User profile
exports.updateProfile = catchAsyncErrors(async (req,res,next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators: true,
        useFindAndModify: false
    })

    // console.log(newUserData)

    // await user.save()
    res.status(200).json({
        success : true,
    })
})

// Get All users
exports.getAllUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.find()

    res.status(200).json({
        success:true,
        user,
    })
})

// Get single users
exports.getSingleUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with this id : ${req.params.id}`)
        )
    }

    res.status(200).json({
        success:true,
        user,
    })
})

// Update User Role --Admin
exports.updateUserRole = catchAsyncErrors(async (req,res,next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }   
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new : true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success : true,
    })
})

// Delete User  --Admin
exports.deleteUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id)
    // console.log(user)
    if(!user){
        return next(
            new ErrorHandler(`User does not exist with this id : ${req.params.id}`)
        )
    }

    await user.remove()
    res.status(200).json({
        success : true,
        message:"User deleted successfully"
    })
})

