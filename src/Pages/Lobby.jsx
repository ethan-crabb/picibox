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

export default function Lobby(props) {
    const {code} = useParams()
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const navigate = useNavigate()
    const [isHost, setIsHost] = useState(false)
    const [lobby, setLobby] = useState(null)

    useEffect(() => {
        socket.emit("get-lobby", {
            code: code
        })
        socket.on("get-lobby", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setLobby(responce.data)
            }
        })
        socket.on("end-game", (responce) => {
            toast.success(responce.data, {
                icon: "❌"
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
    }, [])

    const Players = () => {
        console.log("Loading players")
        console.log(lobby)
        const playersArray = new Array()
        for (let i = 0; i < lobby.length; i++) {
            console.log("Loop iteration")
            playersArray.push(
                <div className="flex aic jcc fdc">
                    <RandomAvatar size={90} avatar={lobby[i].avatar} />
                    <p style={{marginTop: 15}}>{lobby[i].name}</p>
                </div>
            )
        }
        return (
            <div className="flex aic jcc" style={{flexWrap: "wrap", gap: 20}}>
                {playersArray}
            </div>
        )
    }
    const Host = () => {
        const Host = new Array()
        for (let i = 0; i < lobby.length; i++) {
            if (lobby[i].host) {
                if (lobby[i].id === socket.id) {
                    setIsHost(true)
                }
                Host.push(
                    <div className="flex jcsb aic" style={{width: "100%"}}>
                        <div style={{ gap: 20 }} className="flex aic">
                            <RandomAvatar avatar={lobby[i].avatar} />
                            <h3>{lobby[i].name}'s Game</h3>
                        </div>
                        <div style={{boxShadow: "0px 0px 10px rgba(0,0,0,.5)", padding: 10, borderRadius: 10}}>
                            { code }
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
            <div className="flex aic jcc" style={{gap: 20, flex: 1}}>
                <Button col="#FF3F3F" onClick={() => {
                    window.location.replace("/")
                }}>Leave Game</Button>
                {isHost
                    ? <Button col="#00FF85" onClick={() => {
                        startGame(code, lobby, socket)
                    }}>Start Game</Button>
                    : null
                }
            </div>
        )
    }
    if (lobby) {
        return (
            <div className="flex jcsb fdc fill" style={{}}>
                <Host />
                <div style={{width: "100%", marginLeft: "auto", marginRight: "auto"}}>
                    <Players />
                </div>
                <div style={{width: "100%", marginLeft: "auto", marginRight: "auto"}}>
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
