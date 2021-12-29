import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import Home from './Pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Create from './Pages/Create';
import { GameContext } from './Helpers/game';
import Lobby from './Pages/Lobby';
const io = require("socket.io-client");
const socket = io("ws://localhost:8888")

function App() {
    let updateCallback = () => void 0
    const [game, setGame] = useState({
        code: null,
        socket: socket,
        avatar: null,
        update: (newVal, cb) => { updateCallback = cb || function x() { void 0 }; setGame({ ...game, ...newVal }) }
    })
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to the game server!")
        })
    }, [])
    useEffect(() => {
        updateCallback()
        updateCallback = () => void 0
        console.log("Updated game to:", game)
    }, [game])
    if (game.socket !== null) {
        console.log("Loading home !!")
        return (
            <GameContext.Provider value={game}>
                <div className='full flex aic jcc'>
                    <div style={{ width: 1024, height: 682, padding: 50 }}>
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
                            />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/create" element={<Create />} />
                                <Route path="/lobby" element={<Lobby />} />
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
