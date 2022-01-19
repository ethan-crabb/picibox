import { colourMap, fileMap, fullColourMap } from "../Helpers/avatar-bindings";
import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from "../Helpers/game";
import { toast } from "react-toastify";
import Nav from "../Helpers/Nav";
import { useNavigate } from "react-router";
import Connecting from "../Components/Connecting";
import {
    // rest of the elements/components imported remain same
    useParams
} from 'react-router-dom';
import RandomAvatar from "../Components/RandomAvatar";
import Button from "../Components/Button";
import startGame from "../Helpers/start-game";
import PlayerLobby from '../Components/Lobby'
import copy from 'copy-to-clipboard'
import { ModalContext } from "../Helpers/modal.context";

export default function Lobby(props) {
    const { code } = useParams()
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const navigate = useNavigate()
    const [isHost, setIsHost] = useState(false)
    const [lobby, setLobby] = useState(null)
    const modal = useContext(ModalContext)

    useEffect(() => {
        copy(code)
        toast.success("Code copied!", {
            icon: "✔️",
            hideProgressBar: true
        })
        socket.emit("get-lobby", {
            code: code
        })
        socket.on("get-lobby", (responce) => {
            if (!responce.error) {
                setLobby(responce.data)
            }
        })
        socket.on("end-game", (responce) => {
            toast.success(responce.data, {
                icon: "👋"
            })
            Nav(navigate, "/")
        })
        socket.on("new-player", (responce) => {
            setLobby(responce.data)
        })
        socket.on("start-game", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                Nav(navigate, `/game/${code}`)
            }
        })
        socket.on("kick-player", (responce) => {
            toast.success(responce.msg, {
                icon: "❗"
            })
        })
        socket.on("player-left", () => {
            socket.emit("get-lobby", {
                code: code
            })
        })
        socket.on("kicked", () => {
            toast.dismiss()
            Nav(navigate, "/")
            toast.success("You were kicked!", {
                icon: "😢"
            })
        })
    }, [])
    const Host = () => {
        const Host = new Array()
        for (let i = 0; i < lobby.length; i++) {
            if (lobby[i].host) {
                if (lobby[i].id === socket.id) {
                    setIsHost(true)
                }
                Host.push(
                    <div id="lobbyHeadBar" className="flex jcsb aic" style={{ width: "100%" }}>
                        <div style={{ gap: 20 }} className="flex aic">
                            <RandomAvatar id="lobbyOwnerAvatar" avatar={lobby[i].avatar} />
                            <h3>{lobby[i].name}'s Game</h3>
                        </div>
                        <div title="Game Code" className="clickEffect" style={{ boxShadow: "0px 0px 10px #00B2FF", padding: 10, borderRadius: 10, backgroundColor: "#00B2FF", color: "white", cursor: "pointer" }} onClick={() => {
                            copy(code)
                            toast.success("Code copied!", {
                                icon: "✔️",
                                hideProgressBar: true
                            })
                        }}>
                            {code}
                        </div>
                    </div>
                )
            }
        }
        return (
            <>{Host}</>
        )
    }
    const ControlButtons = () => {
        return (
            <div className="flex aic jcc" style={{ gap: 20, flex: 1 }}>
                <Button size="large" col="#FF3F3F" onClick={() => {
                    window.location.replace("/")
                }}>Leave Game</Button>
                {isHost
                    ? <Button size="large" col="#00FF85" onClick={() => {
                        startGame(code, lobby, socket)
                    }}>Start Game</Button>
                    : null
                }
            </div>
        )
    }
    if (lobby) {
        return (
            <div className="flex jcsb fdc fill" style={{ overflow: "hidden" }}>
                <Host />
                <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                    <PlayerLobby lobby={lobby} onClick={(i) => {
                        if (isHost) {
                            if (lobby[i].id !== socket.id) {
                                modal.update({
                                    active: true,
                                    title: "Kick a player",
                                    text: `Are you sure you want to kick ${lobby[i].name}?`,
                                    onClick: () => {
                                        socket.emit("kick-player", {
                                            player: lobby[i].id,
                                            code: code
                                        })
                                    }
                                })
                            }
                        }
                    }} />
                </div>
                <div id="controlButtonsContainer" style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                    <ControlButtons />
                </div>
            </div>
        )
    } else {
        return (
            <Connecting />
        )
    }
}
