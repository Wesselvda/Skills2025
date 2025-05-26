import { Fragment, useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import AdminLogin from "../Components/AdminLogin"


const Admin = () => {
    const { adminData, getAdminData, adminLogout, adminHandleDeactivate, adminHandleAnonymize, adminToggleGameActive, adminReorderGames, adminAddGame, adminEditGame } = useContext(AppContext);

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('admin-token'));

    const [newGame, setNewGame] = useState({
        title: '',
        subtitle: '',
        credit_cost: '',
        image: null
    });

    const [editingGameId, setEditingGameId] = useState(null);
    const [editGameForm, setEditGameForm] = useState({ title: '', subtitle: '', credit_cost: '', image: null });

    useEffect(() => {
        if (loggedIn) {
            if (!adminData) {
                getAdminData();
            } else {
                console.log(adminData);
            }
        }
    }, [loggedIn, adminData])

    function onLogout() {
        adminLogout();
        setLoggedIn(false);
    }

    function moveGame(index, direction) {
        const newGames = [...adminData.games];
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= newGames.length) return;

        [newGames[index], newGames[targetIndex]] = [newGames[targetIndex], newGames[index]];

        const gameIds = newGames.map(game => game.id);
        adminReorderGames(gameIds);
    }

    function handleAddGameSubmit(e) {
        e.preventDefault();
        adminAddGame(newGame).then(() => {
            setNewGame({ title: '', subtitle: '', credit_cost: '', image: null });
        });
    }

    function startEditingGame(game) {
        setEditingGameId(game.id);
        setEditGameForm({
            title: game.title,
            subtitle: game.subtitle,
            credit_cost: game.credit_cost,
            image: null
        });
    }

    function handleEditGameSubmit(e) {
        e.preventDefault();
        adminEditGame(editingGameId, editGameForm).then(() => {
            setEditingGameId(null);
            setEditGameForm({ title: '', subtitle: '', credit_cost: '', image: null });
        });
    }

    return (
        <>
            {loggedIn ? <>
                <h1>Admin panel</h1>
                <button onClick={onLogout}>Logout</button>
                {adminData && <>
                    <h2>Users</h2>
                    {adminData.users.length > 0 ? <>
                        <table>
                            <tr>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Used credits</th>
                                <th>Played games</th>
                                <th>Credits</th>
                            </tr>
                            {adminData.users.map(user => {
                                return <tr key={user.id}>
                                    <td>{user.email || "Anonymous"}</td>
                                    <td>{user.name || "Anonymous"}</td>
                                    <td>{user.credit_transactions_sum_amount || 0}</td>
                                    <td>{user.game_sessions_count}</td>
                                    <td>{user.credits}</td>
                                    <td>
                                        {user.name ?
                                            <>
                                                {user.active ? <button onClick={() => adminHandleDeactivate(user.id)}>Deactivate</button> : <p>Inactive</p>}
                                                <button onClick={() => adminHandleAnonymize(user.id)}>Anonymize</button>
                                            </> : <p>Anonymous</p>}
                                    </td>
                                </tr>
                            })}
                        </table>
                    </> : <h3>There are currently no users</h3>}
                    <h2>Games</h2>
                    <p>Currently available games: {adminData.gameData.currentlyAvailableGames}</p>
                    <p>Amount of games ever played: {adminData.gameData.gamesEveryPlayedCount}</p>
                    <p>Amount credits used by the users: {adminData.gameData.creditSpendCount}</p>
                    <p>User count: {adminData.gameData.userCount}</p>
                    <p>Avarage play per user: {adminData.gameData.avaragePlayPerUser}</p>
                    <p>Avarage credit use per user: {adminData.gameData.avarageCreditUse}</p>
                    {adminData.games.length > 0 ? <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Subtitle</th>
                                    <th>Credit cost</th>
                                    <th>Active</th>
                                    <th>Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminData.games.map((game, index) => {
                                    return <Fragment key={game.id} >
                                        <tr>
                                            <td>{game.title}</td>
                                            <td>{game.subtitle}</td>
                                            <td>{game.credit_cost}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={game.active}
                                                    onChange={(e) => adminToggleGameActive(game.id, e.target.checked)}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => moveGame(index, -1)}>&uarr;</button>
                                                <button onClick={() => moveGame(index, 1)}>&darr;</button>
                                                <button onClick={() => startEditingGame(game)}>Edit</button>
                                            </td>
                                        </tr>
                                        {editingGameId === game.id && (
                                            <tr>
                                                <td colSpan="5">
                                                    <form onSubmit={handleEditGameSubmit}>
                                                        <input
                                                            type="text"
                                                            placeholder="Title"
                                                            value={editGameForm.title}
                                                            onChange={(e) => setEditGameForm({ ...editGameForm, title: e.target.value })}
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Subtitle"
                                                            value={editGameForm.subtitle}
                                                            onChange={(e) => setEditGameForm({ ...editGameForm, subtitle: e.target.value })}
                                                            required
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Credit ocst"
                                                            value={editGameForm.credit_cost}
                                                            onChange={(e) => setEditGameForm({ ...editGameForm, credit_cost: e.target.value })}
                                                            required
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setEditGameForm({ ...editGameForm, image: e.target.files[0] })}
                                                        />
                                                        <button type="submit">Save</button>
                                                        <button type="button" onClick={() => setEditingGameId(null)}>Cancel</button>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                })}
                            </tbody>
                        </table>
                    </> : <h3>There are currently no games</h3>}

                    <h3>Add New Game</h3>
                    <form onSubmit={handleAddGameSubmit}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newGame.title}
                            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Subtitle"
                            value={newGame.subtitle}
                            onChange={(e) => setNewGame({ ...newGame, subtitle: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Credit Cost"
                            value={newGame.credit_cost}
                            onChange={(e) => setNewGame({ ...newGame, credit_cost: e.target.value })}
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewGame({ ...newGame, image: e.target.files[0] })}
                            required
                        />
                        <button type="submit">Add Game</button>
                    </form>

                </>}

            </> : <AdminLogin onLoggedIn={() => { setLoggedIn(true) }} />}
        </>
    )
}

export default Admin