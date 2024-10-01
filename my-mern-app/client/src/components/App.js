import React from "react";
import { Routes, Route } from "react-router-dom";
import PageUser from "../pages/pageUser";
import WeatherForecast from "../pages/weatherForecast";
import MyAccount from "../pages/MyAccount.js";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PageUser />} />
      <Route path="/weather" element={<WeatherForecast />} />
      <Route path="/account" element={<MyAccount />} />
    </Routes>
  );
};

export default App;
