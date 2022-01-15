import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import Home from './Pages/Home';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Create from './Pages/Create';
import { GameContext } from './Helpers/game';
import Lobby from './Pages/Lobby';
import Game from './Pages/Game';
import { ModalContext } from './Helpers/modal.context';
import Modal from './Components/Modal';
import ReactTooltip from 'react-tooltip';
import PromptStore from './Pages/PromptStore';
import CreatePack from './Pages/CreatePack';

const io = require("socket.io-client");
const socket = io("ws://localhost:8888")

function App() {
    const [game, setGame] = useState({
        code: null,
        socket: socket,
        avatar: null,
        createCache: null,
        update: (newVal) => { setGame({ ...game, ...newVal }) }
    })

    const modalRef = useRef({})
    const updateModal = (newValues) => {
        setModal({
            ...modalRef.current,
            ...newValues
        })
    }
    const [modal, setModal] = useState(undefined)
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
            socket.on("disconnect", () => {
                toast.success("Disconnected", {
                    icon: "🚨"
                })
            })
        })

        // Set Modal Context

        setModal({
            active: false,
            title: null,
            text: null,
            onClick: null,
            update: updateModal
        })
        modalRef.current = {
            active: false,
            title: null,
            text: null,
            onClick: null,
            update: updateModal
        }
    }, [])
    const LoadingComponent = () => {
        return (
            <div className='full flex aic jcc fdc'>
                <h1>PiciPici Games</h1>
                Loading...
            </div>
        )
    }
    if (game.socket !== null) {
        if (modal) {
            return (
                <ModalContext.Provider value={modal}>
                    <ReactTooltip />
                    <GameContext.Provider value={game}>
                        <Modal />
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
                                        <Route path="/store" element={<PromptStore />} />
                                        <Route path="/create-pack" element={<CreatePack />} />
                                    </Routes>
                                </Router>
                            </div>
                        </div>
                    </GameContext.Provider>
                </ModalContext.Provider>
            )
        } else {
            return (
                <LoadingComponent />
            )
        }
    } else {
        return (
            <LoadingComponent />
        )
    }
}

export default App;
