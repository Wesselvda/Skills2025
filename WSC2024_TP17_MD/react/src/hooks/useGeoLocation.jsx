import { useState, useEffect } from 'react'

export default function useGeoLocation() {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const lat = url.searchParams.get('latitude')
    const lon = url.searchParams.get('longitude')

    if (lat && lon) {
      setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) })
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          })
        },
        () => {
          console.warn('Geolocation blocked')
        }
      )
    }
  }, [])

  return location
}