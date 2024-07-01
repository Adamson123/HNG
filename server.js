const express = require("express");
const axios = require("axios");
const geoip = require("geoip-lite");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send(
    "Welcome to .... <a href='/api/hello?visitor_name=Adam'>Test</a>"
  );
});

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;

  try {
    const apiKey = "41031635df0050e559be040d9c04356a";
    const getPulicIp = await axios.get("https://api.ipify.org?format=json");
    let publicIp = req.headers["x-forwarded-for"] || req
.connection.remoteAddress;

    const geoipLoc = geoip.lookup(publicIp);

    const location = geoipLoc.city;

    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geoipLoc.ll[0]}&lon=${geoipLoc.ll[1]}&units=metric&exclude=hourly,daily&appid=${apiKey}`;

   // console.log(geoipLoc.ll);
    const getTemperature = await axios.get(openWeatherUrl);

    const resObj = {
      client_ip: publicIp,
      location,
      greeting: `Hello, ${visitor_name}!, the temperature is ${getTemperature.data.main.temp} degrees Celsius in ${location}`,
    };

    res.status(200).json(resObj);
  } catch (error) {
    console.error(`Error`, error.message);
    res.status(500).send("Error Something went wrong");
  }
});

app.listen(5002, () => {
  console.log("Server is onnn ✔✔😁");
});
