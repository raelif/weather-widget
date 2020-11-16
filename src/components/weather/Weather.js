import React from "react";
import "./Weather.scss";

import Cloud from "./assets/Cloud.svg";
import Combined from "./assets/Combined.svg";
import Placeholder from "./assets/Placeholder.svg";
import Rain from "./assets/Rain.svg";
import Snow from "./assets/Snow.svg";
import Storm from "./assets/Storm.svg";
import Sun from "./assets/Sun.svg";

// const strings = ["Feels Like: ", "Humidity: "];

const beautify = function (numb, position = 0) {
  switch (position) {
    case 0:
      return Math.floor(numb) + "°";
    case 1:
      return "Feels Like: " + Math.floor(numb) + "°";
    case 2:
      return "Humidity: " + Math.floor(numb) + "%";
    default:
      return Math.floor(numb);
  }
};

const toDate = function (str) {
  const date = new Date(str);
  const names = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return names[date.getDay()] + " " + date.getDate();
};

const selectImg = function (code) {
  if (code < 300) return Storm;
  if (code < 600) return Rain;
  if (code < 700) return Snow;
  if (code === 800) return Sun;
  if (code < 803) return Combined;
  return Cloud;
};

export default function Weather({
  upperInfo,
  code,
  lowerInfos,
  index = 0,
  isWeek = false,
  click
}) {
  if (isWeek) {
    return (
      <button className="DayOfWeek" onClick={() => click(index)}>
        <p className="DateParag">{toDate(upperInfo)}</p>
        <img className="WeekImg" src={selectImg(code)} alt="weather" />
        <p>{beautify(lowerInfos[0]) + " - " + beautify(lowerInfos[1])}</p>
      </button>
    );
  }

  return (
    <div className="DayCurrent">
      <div className="CityDiv">
        <img className="CityPin" src={Placeholder} alt="pin" />
        <span className="CityText">{upperInfo}</span>
      </div>
      <img className="DayImg" src={selectImg(code)} alt="weather" />
      {lowerInfos.map((info, position) =>
        position === 0 ? (
          <p key={index + "-" + position}>{beautify(info)}</p>
        ) : (
          <p key={index + "-" + position}>{beautify(info, position)}</p>
        )
      )}
    </div>
  );
}
