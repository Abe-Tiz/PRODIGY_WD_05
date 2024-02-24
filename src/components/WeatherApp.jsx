import React, { useState, useEffect } from "react";
import clear_icon from "/images/clear.png";
import cloud_icon from "/images/cloud.png";
import drizzle_icon from "/images/drizzle.png";
import humidity_icon from "/images/humidity.png";
import snow_icon from "/images/snow.png";
import wind_icon from "/images/wind.png";
import rain_icon from "/images/rain.png";

const WeatherApp = () => {
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [temperature, setTemperature] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [searchType, setSearchType] = useState("current"); // Default to current location
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("");
  const [wicon, setWicon] = useState("");

  let _api_key = "30a8ad210490517c86496df98341266a";

  useEffect(() => {
    if (searchType === "current") {
      setLoading(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          fetchWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
        });
      }
    } else {
      setLoading(false);
    }
  }, [searchType]); // Runs whenever searchType changes

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${_api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      updateWeatherState(data);
    } else {
      setError("City not found");
    }
    setLoading(false);
  };

  const fetchWeatherByCity = async () => {
    if (location === "") {
      return;
    }
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${_api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      updateWeatherState(data);
    } else {
      setError("City not found");
    }
    setLoading(false);
  };

    const updateWeatherState = (data) => {
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setTemperature(data.main.temp);
        setCity(data.name);
        setError("");
        setCountry(data.sys.country);
        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
          setWicon(clear_icon);
        } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
          setWicon(cloud_icon);
        } else if (data.weather[0].icon === '03d' || data.weather[0].icon === '03n') {
            setWicon(drizzle_icon);
        } else if (data.weather[0].icon === '04d' || data.weather[0].icon === '04n') {
            setWicon(cloud_icon)
        } else if (data.weather[0].icon === '09d' || data.weather[0].icon === '09n') {
            setWicon(rain_icon)
        } else if (data.weather[0].icon === '10d' || data.weather[0].icon === '10n') {
            setWicon(rain_icon)
        } else if (data.weather[0].icon === '13d' || data.weather[0].icon === '13n') {
            setWicon(snow_icon)
        }
    }     

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const search = () => {
    fetchWeatherByCity();
  };

  return (
    <div className="container bg-[#3C0753] p-0 m-0 min-h-screen  flex flex-col justify-center items-center">
      <h2 className="text-5xl m-10 font-[400] text-white" >Weather App</h2>
      <div className="bg-[#5E1675] w-[500px] h-auto py-2 mb-5  border-1 rounded-lg flex flex-col justify-center items-center">
        <div className="flex flex-col gap-3 py-5">
          {/* Search type selector */}
          <div className="flex flex-row items-center gap-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-purple-600"
                value="current"
                checked={searchType === "current"}
                onChange={handleSearchTypeChange}
              />
              <span className="ml-2 text-white">Current Location</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-purple-600"
                value="manual"
                checked={searchType === "manual"}
                onChange={handleSearchTypeChange}
              />
              <span className="ml-2 text-white">Manual Entry</span>
            </label>
          </div>
          <div className="flex flex-row items-center gap-3">
            {searchType === "manual" && (
              <input
                id="cityInput"
                className="w-[362px] h-10 bg-white border-0 outline-none rounded-full px-5 text-gray-500 font-[400] text-xl"
                type="text"
                placeholder="Search"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            )}

            {/* search icon */}
            {searchType === "manual" && (
              <div
                onClick={search}
                className="flex justify-center items-center w-10 h-10 bg-white border-1 rounded-full cursor-pointer"
              >
                <img src="/images/search.png" alt="" />
              </div>
            )}
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error message */}
        {error && <div className="text-red-500 text-sm mt-3">{error}</div>}

        {/* weather image */}
        <div className="flex justify-center mt-2">
          <img src={wicon} alt="" />
        </div>

        {!loading && !error && (
          <>
            <div className="flex justify-center text-white text-5xl font-[400]">
              {temperature} ℃
            </div>
            <div className="flex justify-center text-white text-3xl font-[400]">
              {city},{" "}
              <span className="text-white text-3xl font-[400] ml-5">
                {country}
              </span>
            </div>

            {/* data container */}
            <div className="flex justify-center gap-24 mt-10 text-center items-center text-white mb-10">
              {/* humidity */}
              <div className="flex items-start gap-5 m-auto ml-3">
                <img className="mt-2" src="/images/humidity.png" alt="" />
                <div className="text-xl font-[400]">
                  <div>{humidity}%</div>
                  <div className="text-xl font-[400]">Humidity</div>
                </div>
              </div>

              {/* wind speed */}
              <div className="flex items-start gap-5 m-auto">
                <img className="mt-2" src="/images/wind.png" alt="" />
                <div className="text-xl font-[400]">
                  <div>{wind} km/h</div>
                  <div className="text-xl font-[400]">Wind Speed</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
