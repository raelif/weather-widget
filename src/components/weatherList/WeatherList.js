import React from "react";
import "./WeatherList.scss";

import Weather from "../weather/Weather";

export default function WeatherList({ week, clickDay }) {
  return (
    <div className="WeekContainer">
      {week.map((day, position) => (
        <Weather
          key={position}
          upperInfo={day.valid_date}
          code={day.weather.code}
          lowerInfos={[day.max_temp, day.min_temp]}
          index={position}
          isWeek={true}
          click={clickDay}
        />
      ))}
    </div>
  );
}
