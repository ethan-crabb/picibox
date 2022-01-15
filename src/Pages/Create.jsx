import React, { useContext, useEffect, useState } from 'react'
import Button from '../Components/Button'
import Container from '../Components/Container'
import Input from '../Components/Input'
import Link from '../Components/Link'
import RandomAvatar from '../Components/RandomAvatar'
import { toast } from 'react-toastify';
import { createGame } from '../Helpers/create-game'
import { GameContext } from '../Helpers/game'
import Nav from '../Helpers/Nav'
import { useNavigate } from 'react-router'
import copy from 'copy-to-clipboard'
import Switch from "react-switch";
import ReactTooltip from 'react-tooltip';
import { ModalContext } from '../Helpers/modal.context'

export default function Create() {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const [maxPlayers, setMaxPlayers] = useState("")
    const [timeAprox, setTimeAprox] = useState()
    const [playerName, setPlayerName] = useState("")
    const [useAI, setUseAI] = useState(true)
    const modalAPI = useContext(ModalContext)
    const navigate = useNavigate()
    const SettingsContainer = (props) => {
        return (
            <div style={{ flex: 1, paddingRight: 10, lineHeight: 1.2 }}>
                {props.children}
            </div>
        )
    }
    useEffect(() => {
        socket.on("create-game", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                copy(responce.data)
                setTimeout(() => {
                    toast.dismiss()
                    setTimeout(() => {
                        toast.success("Code copied!", {
                            icon: "✔️",
                            hideProgressBar: true
                        })
                        Nav(navigate, `/lobby/${responce.data}`)
                    }, 500)
                }, 1000)
            }
        })
        document.getElementById("create-maxPlayers").focus()
    }, [])
    useEffect(() => {
        document.getElementById("create-rounds").focus()
    }, [timeAprox])
    useEffect(() => {
        document.getElementById("create-maxPlayers").focus()
    }, [maxPlayers])
    useEffect(() => {
        document.getElementById("create-name").focus()
    }, [playerName])
    return (
        <Container flex fill fdc aifs>
            <div style={{ padding: 50, paddingLeft: 0, height: "fit-content", gap: 30, fontSize: 30, lineHeight: 1.2 }} className='flex aic jcc'>
                <RandomAvatar regen />
                New Lobby
            </div>
            <div style={{ width: "100%", height: "100%", position: "relative" }} className='flex aic jcc fdc'>
                <div className='flex jcsb' style={{ padding: "0px", position: "relative", width: "100%", height: "80%" }}>
                    <SettingsContainer>
                        <h2>Game <br /> Settings</h2>
                        <br />
                        <br />
                        <Input value={maxPlayers} onChange={(e) => { setMaxPlayers(e.target.value) }} type="number" id="create-maxPlayers" placeholder="Max Players" />
                        <br />
                        <Input value={timeAprox} onChange={(e) => { setTimeAprox(e.target.value) }} type="number" id="create-rounds" placeholder="Rounds" />
                        <p id="createTimeAprox">About: {((parseInt(timeAprox) * 3) > 120 ? "> 2" : parseInt(timeAprox) * 3) || 0}  {(parseInt(timeAprox) * 3) > 120 ? "hours" : "minutes"}</p>
                    </SettingsContainer>
                    <SettingsContainer>
                        <h2>Your <br /> Settings</h2>
                        <br />
                        <br />
                        <Input value={playerName} onChange={(e) => { setPlayerName(e.target.value) }} id="create-name" placeholder="Name" />
                        <br />
                        <div className='flex aic' style={{ width: 250, height: 65, gap: 10 }}>
                            <ReactTooltip effect='solid' className='aiTooltip' place='bottom' />
                            <Switch activeBoxShadow="none" checkedIcon={<div style={{ width: 150, position: "relative", left: 40, top: 10, opacity: 1, fontSize: 13, color: "white" }}>AI Prompts</div>} uncheckedIcon={<div style={{ width: 150, position: "relative", right: 85, top: 10, opacity: .6, fontSize: 13 }}>Non AI Prompts</div>} width={180} height={35} checked={useAI} onChange={(checked) => setUseAI(checked)} onColor='#00B2FF' offColor='#EAEAEA' className='aiSwitch' />
                            <svg style={{ fill: "#757575", cursor: "pointer" }} onClick={() => {
                                modalAPI.update({
                                    active: true,
                                    title: "AI Prompts",
                                    text: "We use boardhuman's writing prompt generator to generate prompts for your party."
                                })
                            }} data-tip="Use an AI engine to generate prompts for your party" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                        </div>
                    </SettingsContainer>
                    <div className="playGuide flex aic jcc fdc">
                        <div style={{ width: "100%", textAlign: "center" }}>
                            How to play
                        </div>
                        <ul>
                            <li>Share your code</li>
                            <li>Give people time to join the lobby</li>
                            <li>Start the game!</li>
                            <li>You'll be able to play too</li>
                        </ul>
                    </div>
                </div>
                <div className='flex aic jcc' style={{ gap: 20 }}>
                    <Button onClick={() => {
                        if (!useAI) {
                            createGame("create-maxPlayers", "create-rounds", "create-name", null, null, false, true, [
                                "create-maxPlayers", "create-rounds", "create-name", gameInstance.avatar, socket
                            ], navigate, gameInstance)
                        } else {
                            createGame("create-maxPlayers", "create-rounds", "create-name", gameInstance.avatar, socket)
                        }
                    }}>
                        Create Game
                    </Button>
                    <Button onClick={() => {
                        createGame("10", "1", "Ethan", gameInstance.avatar, socket, true)
                    }}>
                        Test Game
                    </Button>
                </div>
                <p style={{ fontSize: 12, marginTop: 5 }}>or <Link go="/">join game</Link></p>

            </div>
        </Container>
    )
}
