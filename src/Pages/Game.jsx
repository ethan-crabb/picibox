import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { GameContext } from '../Helpers/game'
import Zoom from 'react-reveal/Zoom'
import { toast } from "react-toastify";
import Nav from "../Helpers/Nav";
import { useNavigate } from "react-router";
import RandomAvatar from "../Components/RandomAvatar";
import Connecting from '../Components/Connecting';
import Button from '../Components/Button';
import Container from '../Components/Container';

export default function Game() {
    const navigate = useNavigate()
    const { code } = useParams()
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const [prompt, setPrompt] = useState(null)
    const [lobby, setLobby] = useState(null)
    const [owner, setOwner] = useState(false)
    const [stage, setStage] = useState(1)
    const [submitedAnswer, setSubmitedAnswer] = useState(false)
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
                for (let i = 0; i < responce.data.length; i++) {
                    if (responce.data[i].host) {
                        if (responce.data[i].id === socket.id) {
                            setOwner(true)
                        } else {
                            setOwner(false)
                        }
                    }
                }
                setLobby(responce.data)
            }
        })
        socket.on("new-prompt", (responce) => {
            console.log("Recceived new prompt")
            setStage(1)
            setPrompt(responce.data)
            setSubmitedAnswer(false)
        })
        socket.on("end-game", (responce) => {
            toast.success(responce.data, {
                icon: "❌"
            })
            Nav(navigate, "/")
        })
        socket.on("init-round", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setStage(2)
            }
        })
        socket.on("submit-answer", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setSubmitedAnswer(true)
            }
        })
        socket.on("review-game", (responce) => {
            setStage(3)
            console.log(responce.data)
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
    const PromptComponent = (props) => {
        return (
            <Zoom>
                <div className="flex aic jcc fdc" style={{gap: 20}}>
                    <div className="promptContainer flex aic jcc">
                        {prompt}
                    </div>
                    {props.disableRefresh
                        ? null
                        : <div>
                            {owner
                            ? <Button onClick={() => {
                                socket.emit("refresh-prompt", {
                                    code: code
                                })
                            }} col="#00B2FF">Refresh</Button>
                                : null
                            }
                        </div>
                    }
                </div>
            </Zoom>
        )
    }
    if (lobby) {
        if (stage === 1) {
            return (
                <div className="flex aic jcsb fdc" style={{height: "80%"}}>
                    <div>
                        {prompt
                            ? <PromptComponent />
                            : <div className="emptyPrompt"></div>
                        }
                    </div>
                    <div>
                        <Players />
                    </div>
                    <div>
                        {owner
                            ? <Button size="large" onClick={() => {
                                socket.emit("init-round", {
                                    code: code
                                })
                            }}>Begin round</Button>
                            : "Waiting to start..."
                        }
                    </div>
                </div>
            )
        } else if (stage === 2) {
            if (submitedAnswer) {
                return (
                    <Zoom>
                        <Container flex aic jcc full fdc>
                            <h1>You've submitted your responce!</h1>
                            <br/>
                            <h5>Wait for the others to finish</h5>
                        </Container>
                    </Zoom>
                )
            } else {
                return (
                    <div className="flex aic jcsb fdc" style={{height: "100%", gap: 20}}>
                        <div>
                            <PromptComponent disableRefresh />
                        </div>
                        <div className="flex aic jcc fdc">
                            <div contentEditable id="prompt-editor" className="textarea"></div>
                            <Button size="small" onClick={() => {
                                console.log("Emmiting socket call")
                                const el = document.getElementById("prompt-editor").textContent
                                if (el) {
                                    socket.emit("submit-answer", {
                                        code: code,
                                        answer: el
                                    })
                                } else {
                                    toast.success("Must fill in the box!", {
                                        icon: "❌"
                                    })
                                }
                            }}>Submit</Button>
                        </div>
                        <div>
                            <Players />
                        </div>
                    </div>
                )
            }
        } else if (stage === 3) {

        }
    } else {
        return <Connecting />
    }
}
