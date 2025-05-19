import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/games", { withCredentials: true })
      .then((res) => {
        setGames(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch games:", err);
      });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <div className="homepage-grid">
        {games.map((game) => (
          <Link key={game.id} to={`/game/${game.id}`}>
            <img
              src={"/assets/images/" + game.image_path}
              alt={game.title ?? "Game"}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;