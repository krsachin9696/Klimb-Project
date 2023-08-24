const mongoose = require("mongoose");

module.exports.init = async function() 
{
    await mongoose.connect('mongodb+srv://klimb:1TPmQI7aQsQSLpSm@cluster0.6eyhd80.mongodb.net/klimbTable?retryWrites=true&w=majority');
}