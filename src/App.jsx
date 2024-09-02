import { useEffect, useState } from 'react';
import './App.css';
import searchIcon from "./assets/search.jpg";
import clearIcon from "./assets/clear.jpg";
import drizzleIcon from "./assets/drizzle.jpg";
import humidityIcon from "./assets/humidity.jpg";
import rainIcon from "./assets/rain.jpg";
import snowIcon from "./assets/snow.jpg";
import windIcon from "./assets/wind.jpg";
import propTypes from "prop-types";

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}, {country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes={
  icon: propTypes.string.isRequired,
  temp: propTypes.number.isRequired,
  city: propTypes.string.isRequired,
  country: propTypes.string.isRequired,
  humidity: propTypes.number.isRequired,
  lat: propTypes.number.isRequired,
  log: propTypes.number.isRequired,
}

function App() {
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("chennai");
  const [country, setCountry] = useState("india");
  const [lat, setLat] = useState("0");
  const [log, setLog] = useState("0");
  const [humidity, setHumidity] = useState("0");
  const [wind, setWind] = useState("0");
  const [text, setText] = useState("");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const api_key = "c32e67fe187df8647d7be5f8de295032";
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": drizzleIcon,
    "02n": drizzleIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occured while fetching weather date.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  } ,[]);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityinput"
            placeholder="Search city"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={search}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        {loading && <div className="loading-message">loading....</div>}
        {error && <div className="error-message">{Error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

       { !loading && !cityNotFound && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humidity={humidity}
          wind={wind}
        />}
        <p className="copyright">
          Designed by <span> Ragav</span>
        </p>
      </div>
    </>
  );
}

export default App;