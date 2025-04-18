const express = require('express');
const fetch = require ('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.ACCESS_KEY;

app.use(express.static(path.join(__dirname,'public')));

app.get('/api/weather/:location', async (req, res) => {

    const location = req.params.location;

    try {
        
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY  }&query=${location}`);

        const data = await response.json();

        if(data.error){
            return res.status(400).json({error:data.error.info});
        }
        
        return res.json(data);
    } catch (error) {
        console.error('error:',error);
        return res.status(500).json({error: 'failed to getch weather data'});
    }
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`);
});


