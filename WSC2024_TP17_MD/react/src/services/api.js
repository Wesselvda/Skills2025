const API_BASE = 'http://127.0.0.1:3001/module_d_api.php'

export const fetchCarparks = () => fetch(`${API_BASE}/carparks.json`).then(res => res.json())

export const fetchEvents = (beginning_date, ending_date) => {
  let url = `${API_BASE}/events.json`
  if (beginning_date || ending_date) {
    const params = new URLSearchParams()
    if (beginning_date) params.append('beginning_date', beginning_date)
    if (ending_date) params.append('ending_date', ending_date)
    url += '?' + params.toString()
  }
  return fetch(url).then(res => res.json())
}

export const fetchWeather = () => fetch(`${API_BASE}/weather.json`).then(res => res.json())
