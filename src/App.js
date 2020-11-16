import React, { Component } from "react";

import Weather from "./components/weather/Weather";
import WeatherList from "./components/weatherList/WeatherList";
import "./styles.scss";

// import { mockWeather } from "./components/static-data";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.fetchWeather = this.fetchWeather.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  readUrlParams() {
    const hrefAndParams = document.location.href.split("?");
    if (hrefAndParams.length > 1) {
      return hrefAndParams[1].split("&").filter((p) => {
        const [key, value] = p.split("=");
        return key?.length && value?.length;
      });
    }
  }

  isolateTestVariation(params) {
    return params?.reduce((acc, cur) => {
      if (acc === "") {
        const aid = cur.split("testVariation=");
        if (aid.length > 1) return acc + aid[1];
      }
      return acc;
    }, "");
  }

  constructUrlForRequest(position, params) {
    return `https://api.weatherbit.io/v2.0/forecast/daily?lat=${
      position.coords.latitude
    }&lon=${position.coords.longitude}&days=7${
      params ? params.reduce((acc, cur) => acc + "&" + cur, "") : ""
    }`;
  }

  fetchWeather(url, testVariationValue) {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result?.data) {
          this.setState({
            current: 0,
            city: result.city_name,
            wData: result.data.map((obj) => ({
              ...obj,
              weather: { ...obj.weather }
            })),
            testVariation: testVariationValue
          });
        }
      });
  }

  handleClick(newCurrent) {
    switch (this.state.testVariation) {
      case "a":
        console.log("Day clicked with variation a");
        break;
      case "b":
        console.log("Day clicked with variation b");
        break;
      default:
        console.log("Day clicked with no variation");
    }
    this.setState({
      ...this.state,
      current: newCurrent
    });
  }

  componentDidMount() {
    const params = this.readUrlParams();
    const testVariationValue = this.isolateTestVariation(params);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const url = this.constructUrlForRequest(position, params);
        // console.log(url);

        this.fetchWeather(url, testVariationValue);
      },
      (error) =>
        console.error("Error Code = " + error.code + " - " + error.message),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  renderTestVariation() {
    switch (this.state.testVariation) {
      case "a":
        return (
          <p className="Copy">Find out what the weather will be this week</p>
        );
      case "b":
        return (
          <p className="Copy">Click to see the weather for the next few days</p>
        );
      default:
        return null;
    }
  }

  render() {
    if (this.state.wData) {
      const today = this.state.wData[this.state.current];
      // console.log(this.state);
      return (
        <div className="App">
          <Weather
            upperInfo={this.state.city}
            code={today.weather.code}
            lowerInfos={[
              today.temp,
              (today.app_max_temp + today.app_min_temp) / 2,
              today.rh
            ]}
            index={this.state.current}
          />

          {this.renderTestVariation()}
          <hr className="Line" />

          <WeatherList week={this.state.wData} clickDay={this.handleClick} />
        </div>
      );
    }
    return null;
  }
}
