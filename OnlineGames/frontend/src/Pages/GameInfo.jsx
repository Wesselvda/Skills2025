import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../contexts/AppContext";

const GameInfo = () => {
  const { user, checkAuth, loading: userLoading } = useContext(AppContext);
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState("");
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    fetchGame();
    checkActiveSession();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/games/${gameId}`, {
        withCredentials: true,
      });
      setGame(res.data);
    } catch (err) {
      setError("Failed to load game.");
    } finally {
      setLoadingGame(false);
    }
  };

  const checkActiveSession = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/games/sessions/active`, {
        withCredentials: true,
      });
      setActiveSession(res.data.session || null);
    } catch (err) {
      setActiveSession(null);
    }
  };

  const handleStartGame = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsStarting(true);
    setError("");

    try {
      await axios.post(
        `http://localhost:5000/api/games/${gameId}/start`,
        {},
        { withCredentials: true }
      );
      await checkAuth();
      await checkActiveSession();
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to start the game.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndGame = async () => {
    if (!activeSession) return;

    setIsEnding(true);
    setError("");

    try {
      await axios.post(
        `http://localhost:5000/api/games/sessions/${activeSession.id}/end`,
        {},
        { withCredentials: true }
      );
      await checkAuth();
      await checkActiveSession();
    } catch (err) {
      setError("Failed to end the game.");
    } finally {
      setIsEnding(false);
    }
  };

  if (loadingGame || userLoading) return <div>Loading...</div>;
  if (!game) return <div>{error || "Game not found."}</div>;

  const isLoggedIn = !!user;
  const hasEnoughCredits = user?.credits >= game.credit_cost;
  const isCurrentGameActive = activeSession?.game_id === game.id;
  const isAnotherGameActive = activeSession && !isCurrentGameActive;
  const canStart = isLoggedIn && hasEnoughCredits && !activeSession;

  return (
    <div className="game-info">
      <h1>{game.title}</h1>
      <img src={`/assets/images/${game.image_path}`} alt={game.title} className="game-image" />
      <p>{game.description}</p>
      <p><strong>Credits required:</strong> {game.credit_cost}</p>
      {isLoggedIn && <p><strong>Your credits:</strong> {user.credits}</p>}

      {error && <p className="error-text">{error}</p>}

      {!isLoggedIn ? (
        <p className="error-text">Please <button onClick={() => navigate("/login")} className="link-button">log in</button> to play.</p>
      ) : isCurrentGameActive ? (
        <>
          <p className="info-text">You're currently playing this game</p>
          <button onClick={handleEndGame} disabled={isEnding}>
            {isEnding ? "Ending..." : "End Game"}
          </button>
        </>
      ) : isAnotherGameActive ? (
        <p className="error-text">You're already in a game. end it before starting another</p>
      ) : !hasEnoughCredits ? (
        <p className="error-text">Not enough credits</p>
      ) : (
        <button onClick={handleStartGame} disabled={isStarting || !canStart}>
          {isStarting ? "Starting..." : "Start the Game"}
        </button>
      )}
    </div>
  );
};

export default GameInfo;