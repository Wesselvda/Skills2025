import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCarparks } from '../services/api'
import useGeoLocation from '../hooks/useGeoLocation'
import { calculateDistance } from '../utils/distance'

export default function CarparkDetail() {
  const { name } = useParams()
  const [carpark, setCarpark] = useState(null)
  const location = useGeoLocation()

  useEffect(() => {
    fetchCarparks().then(data => {
      const info = data[name]
      if (info) {
        const carparkWithName = { name, ...info }
        if (location) {
          carparkWithName.distance = calculateDistance(
            location.latitude,
            location.longitude,
            info.latitude,
            info.longitude
          )
        }
        setCarpark(carparkWithName)
      }
    })
  }, [name, location])

  if (!carpark) return <p>Loading...</p>

  return (
    <div className="carpark-detail">
      <h2>{carpark.name}</h2>
      <p>Available Spaces: {carpark.availableSpaces}</p>
      <p>Location: {carpark.location}</p>
      {carpark.distance && (
        <p>Distance: {carpark.distance.toFixed(2)} km</p>
      )}
    </div>
  )
}
