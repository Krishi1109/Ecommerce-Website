const { connect } = require('http2')
const mongoose = require('mongoose')

const connectDatabase = ( ) => {
    mongoose.connect(process.env.DB_URI , {
        useNewUrlParser:true
    }).then((data) => {
        console.log(`Mongodb connect with server : ${data.connection.host}`)
    })
}

module.exports = connectDatabase