import { useEffect, useState } from 'react'
import { fetchCarparks } from '../services/api'
import useGeoLocation from '../hooks/useGeoLocation'
import { calculateDistance } from '../utils/distance'
import { Link } from 'react-router-dom'

export default function Carparks() {
  const [carparks, setCarparks] = useState([])
  const [pinned, setPinned] = useState([])
  const [sortBy, setSortBy] = useState('alphabet')
  const location = useGeoLocation()

  useEffect(() => {
    const savedSort = localStorage.getItem('carparkSort') || 'alphabet'
    setSortBy(savedSort)
  }, [])
  
  useEffect(() => {
    const pinnedStorage = JSON.parse(localStorage.getItem('pinnedCarparks')) || []
    setPinned(pinnedStorage)

    fetchCarparks().then(data => {
      const parsed = Object.entries(data).map(([name, info]) => ({
        name,
        ...info
      }))
      setCarparks(parsed)
    })
  }, [])

  const togglePin = (name) => {
    const updated = pinned.includes(name)
      ? pinned.filter(item => item !== name)
      : [...pinned, name]
    setPinned(updated)
    localStorage.setItem('pinnedCarparks', JSON.stringify(updated))
  }

  const sortedCarparks = () => {
    let list = [...carparks]

    if (sortBy === 'alphabet') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'distance' && location) {
      list.forEach(c => {
        c.distance = calculateDistance(
          location.latitude,
          location.longitude,
          c.latitude,
          c.longitude
        )
      })
      list.sort((a, b) => a.distance - b.distance)
    }

    const pinnedList = list.filter(cp => pinned.includes(cp.name))
    const unpinnedList = list.filter(cp => !pinned.includes(cp.name))
    return [...pinnedList, ...unpinnedList]
  }

  return (
    <div className="carpark-page">
      <button onClick={() => {
        let newSortBy = sortBy === 'alphabet' ? 'distance' : 'alphabet';
        setSortBy(newSortBy)
        localStorage.setItem('carparkSort', newSortBy);
      }}>
        Sort by: {sortBy === 'alphabet' ? 'A > Z' : 'Distance'}
      </button>

      {sortedCarparks().map(cp => (
        <div key={cp.name} className="carpark-item">
          <h3>
            <Link to={`/carparks/${encodeURIComponent(cp.name)}`}>
              {cp.name}
            </Link>
          </h3>
          <p>{cp.location}</p>
          <p>Available Spaces: {cp.availableSpaces}</p>
          {sortBy === 'distance' && cp.distance && (
            <p>Distance: {cp.distance.toFixed(2)} km</p>
          )}
          <button onClick={() => togglePin(cp.name)}>
            {pinned.includes(cp.name) ? 'Unpin' : 'Pin'}
          </button>
        </div>
      ))}
    </div>
  )
}
