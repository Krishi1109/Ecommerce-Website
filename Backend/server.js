const app = require("./app")

const dotenv = require('dotenv')
const connectDatabase = require("./config/database")

// Handling Uncaught Exception
process.on("uncaughtException", (err)=> {
        console.log(`Error : ${err.message}`)
        console.log(`Shutting down the server due to Handling Uncaught Exception`)
        process.exit(1)
})

// config
dotenv.config({path: "Backend/config/config.env"})

//connecting to Database
connectDatabase()


// Listen port
app.listen(process.env.PORT, () =>{
        console.log(`Server is running on Port ${process.env.PORT}`)
})

// Unhandled Promise Rejections
process.on("unhandledRejection", err => {
        console.log(`Error: ${err.message}`)
        console.log(`Shutting down the server due to unhandled Promise Rejections`)

        Server.close(() => {
                process.exit(1)
        })
})