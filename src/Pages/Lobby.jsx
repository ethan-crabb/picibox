import { colourMap, fileMap, fullColourMap } from "../Helpers/avatar-bindings";
import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from "../Helpers/game";
import { toast } from "react-toastify";
import Nav from "../Helpers/Nav";
import { useNavigate } from "react-router";
import Connecting from "../Components/Connecting";

export default function Lobby() {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const navigate = useNavigate()
    const [lobby, setLobby] = useState(null)
    useEffect(() => {
        console.log("gameInstance in lobby useEffect:", gameInstance)
        if (gameInstance.code && gameInstance.socket) {
            socket.emit("get-lobby", {
                code: gameInstance.code
            })
            socket.on("get-lobby", (responce) => {
                if (responce.error) {
                    toast.success(responce.msg, {
                        icon: "❗",
                        hideProgressBar: true
                    })
                } else {
                    setLobby(responce.data)
                }
            })
        } else {
            toast("Invalid Game", {
                icon: "❗",
                hideProgressBar: true
            })
            Nav(navigate, "/")
        }
    }, [])
    if (lobby) {
        return (
            <div>
                In game {gameInstance.code}
            </div>
        )
    } else {
        return (
            <Connecting />
        )
    }
}
