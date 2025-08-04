import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/carparks">Carparks</NavLink>
      <NavLink to="/events">Events</NavLink>
      <NavLink to="/weather">Weather</NavLink>
      <NavLink to="/settings">Settings</NavLink>
    </nav>
  )
}
