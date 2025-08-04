import { useEffect, useState } from 'react'
import { fetchWeather } from '../services/api'
import SVGIcon from '../components/SVGIcon'

export default function Weather() {
  const [forecast, setForecast] = useState([])

  useEffect(() => {
    fetchWeather().then(data => {
      setForecast(data)
    })
  }, [])

  return (
    <div className="weather-page">
      <div className="weather-scroll">
        {forecast.map((day, idx) => (
          <div className="weather-card" key={idx}>
            <p>{day.date}</p>
            <SVGIcon name={day.status} />
            <p>{day.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
