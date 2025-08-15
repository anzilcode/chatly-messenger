const mongoose = require('mongoose');
require('dotenv').config();

const DbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,     
            useUnifiedTopology: true    
        });
        console.log('Database Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = DbConnect;



// const mongoose = require('mongoose')

// require ('dotenv').config()

// const DbConnect = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URI)
//         console.log('Database Connected')
//     } catch (error) {
//         console.log(error)
//     }
// }

// module.exports = DbConnect
