require("dotenv/config")
const express = require("express");
const axios = require("axios");
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send(" <h1>Welcome to ....<a href='/api/hello?visitor_name=Adam'>Test</a></h1>");
});


const apiKey = "41031635df0050e559be040d9c04356a"

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;

  try {
   
    let userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    
    userIp = userIp.split(',')[0];
    console.log(userIp);

    
    const geoRes = await axios.get(`http://ip-api.com/json/${userIp}`);
    
    console.log(geoRes);
    const { location, lat, lon } = geoRes.data.city;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherUrl);
    const temperature = weatherResponse.data.main.temp;



    const responseObj = {
      client_ip: userIp,
      location,
      greeting: `Hello, ${visitor_name ? visitor_name : "Unknown🙄"}!, the temperature is ${temperature} degrees Celsius in ${location}`,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    //console.error(`Error:`, error.message);
    res.status(500).send("Something went wrong");
  }
});

app.listen(5002, () => {
  console.log("Server is running on port 5002 ✔✔😁");
});