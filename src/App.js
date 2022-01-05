import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import Home from './Pages/Home';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Create from './Pages/Create';
import { GameContext } from './Helpers/game';
import Lobby from './Pages/Lobby';
import Game from './Pages/Game';
const io = require("socket.io-client");
const socket = io("ws://localhost:8888")

function App() {
    const [game, setGame] = useState({
        code: null,
        socket: socket,
        avatar: null,
        update: (newVal) => { setGame({ ...game, ...newVal }) }
    })
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to the game server!")
            console.log(sessionStorage.getItem("token"))
            socket.emit("log-on", {
                id: sessionStorage.getItem("token")
            })
            socket.on("save-socket", (responce) => {
                console.log("Saving socket to localstorage")
                sessionStorage.setItem("token", responce.data)
            })
            socket.on("player-left", (responce) => {
                toast.success(responce.data, {
                    icon: "👋"
                })
            })
            socket.on("server-error", (error) => {
                toast.success(error.msg, {
                    icon: "🚨"
                })
            })
        })
    }, [])
    if (game.socket !== null) {
        return (
            <GameContext.Provider value={game}>
                <div className='full flex aic jcc'>
                    <div style={{ width: 1024, height: 650 }} className="flex aic jcc">
                        <Router>
                            <ToastContainer
                                position="bottom-center"
                                autoClose={3000}
                                hideProgressBar={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                progressStyle={{ backgroundColor: "#00B2FF" }}
                                hideProgressBar={true}
                            />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/create" element={<Create />} />
                                <Route path="/lobby/:code" element={<Lobby />} />
                                <Route path="/game/:code" element={<Game />} />
                            </Routes>
                        </Router>
                    </div>
                </div>
            </GameContext.Provider>
        )
    } else {
        console.log(game)
        return (
            <div className='full flex aic jcc fdc'>
                <h1>PiciPici Games</h1>
                Loading...
            </div>
        )
    }
}

export default App;
