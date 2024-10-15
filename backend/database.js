const mongoose = require('mongoose')

//mongoose.connect('mongodb://database/mydatabase')

mongoose.connect('mongodb://database:27017/flexem')
.then(db => console.log("Conectado por: ", db.connection.host))
.catch(err => console.log(err))