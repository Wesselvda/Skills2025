import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const [title, setTitle] = useState("");
  const [backURL, setBackURL] = useState("");
  let location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/weather") {
      setTitle("Weather");
      setBackURL(null);
    } else if (location.pathname === "/carparks") {
      setTitle("Carparks");
      setBackURL(null);
    } else if (location.pathname.startsWith("/carparks/")) {
      setTitle("Carpark");
      setBackURL("/carparks");
    } else if (location.pathname === "/events") {
      setTitle("Events");
      setBackURL(null);
    } else if (location.pathname === "/settings") {
      setTitle("Settings");
      setBackURL(null);
    } else {
      setTitle("");
      setBackURL(null);
    }
  }, [location]);


  return (
    <header className='main-header'>
      <h1>{title}</h1>
      {backURL && <Link className='back-link' to={backURL}>Back</Link>}
    </header>
  )
}

export default Header