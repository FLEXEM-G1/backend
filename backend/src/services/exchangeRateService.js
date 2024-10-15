const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Función para obtener y guardar la tasa de cambio
const fetchExchangeRates = async () => {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const data = response.data;

        // Guardar los datos en un archivo JSON
        const filePath = path.join(__dirname, 'exchange_rates.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        console.log('Tasa de cambio guardada:', data);
    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error.message);
    }
};

// Programar la tarea para que se ejecute una vez al día a las 00:00
cron.schedule('0 0 * * *', fetchExchangeRates);

// Exportar la función si deseas usarla en otros archivos
module.exports = fetchExchangeRates;