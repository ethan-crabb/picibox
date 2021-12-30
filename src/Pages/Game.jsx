import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';import { GameContext } from '../Helpers/game'
import Zoom from 'react-reveal/Zoom'
import { toast } from "react-toastify";
import Nav from "../Helpers/Nav";
import { useNavigate } from "react-router";
import RandomAvatar from "../Components/RandomAvatar";
import Connecting from '../Components/Connecting';

export default function Game() {
    const navigate = useNavigate()
    const { code } = useParams()
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const [prompt, setPrompt] = useState(null)
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
        socket.on("new-prompt", (responce) => {
            console.log("Recceived new prompt")
            responce.data.replace("<br />", "")
            setPrompt(responce.data)
        })
        socket.on("end-game", (responce) => {
            toast.success(responce.data, {
                icon: "❌"
            })
            Nav(navigate, "/")
        })
    }, [])
    const Players = () => {
        console.log("Loading players")
        console.log(lobby)
        const playersArray = new Array()
        for (let i = 0; i < lobby.length; i++) {
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
    const PromptComponent = () => {
        return (
            <Zoom>
                <div className="promptContainer flex aic jcc">
                    {prompt}
                </div>
            </Zoom>
        )
    }
    if (lobby) {
        return (
            <div>
                <div>
                    {prompt
                        ? <PromptComponent />
                        : <div className="emptyPrompt"></div>
                    }
                </div>
                <br />
                <br/>
                <div>
                    <Players />
                </div>
            </div>
        )
    } else {
        return <Connecting />
    }
}
