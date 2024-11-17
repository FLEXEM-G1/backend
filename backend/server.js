const express = require('express');
const cors = require('cors');
const fetchExchangeRates  = require('./src/services/exchangeRateService.js')

const app = express()
//docker-compose exec webapp npm install
require("./database.js")

app.use(cors());
app.use(express.json());

app.use(require("./src/routes/userRoutes.js"));
app.use(require("./src/routes/portfolioRoutes.js"));
app.use(require("./src/routes/bankRoutes.js"));
app.use(require("./src/routes/invoiceBillRoutes.js"));

fetchExchangeRates();

app.listen(3000, () => {
    console.log('Listening to port 3000')
})

