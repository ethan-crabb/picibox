import copy from 'copy-to-clipboard'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Button from '../Components/Button'
import Input from '../Components/Input'
import createPack from '../Helpers/createPack'
import { GameContext } from '../Helpers/game'
import Nav from '../Helpers/Nav'

export default function CreatePack() {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const navigate = useNavigate()
    useEffect(() => {
        socket.on("create-prompt-pack", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                toast.success(`Pack created!`, {
                    icon: "🗂️"
                })
                copy(responce.data)
                toast.success("Pack code copied", {
                    icon: "✔️"
                })
                Nav(navigate, "/")
            }
        })
    }, [])
    const SettingsContainer = (props) => {
        return (
            <div style={{ flex: 1, paddingRight: 10, lineHeight: 1.2 }}>
                {props.children}
            </div>
        )
    }
    const PromptInputMassRender = () => {
        const renderArray = new Array()
        for (let i = 0; i < 15; i++) {
            renderArray.push(
                <Input id={`packPromptInput${i}`} placeholder="Prompt" />
            )
        }
        return (
            <div style={{ maxHeight: 400, width: 1000, flexWrap: "wrap", gap: 10 }} className='flex'>
                {renderArray}
            </div>
        )
    }
    const exportPack = () => {
        let promptsValuesArray = new Array()
        if (document.getElementById("packNameCreatePack").value) {
            if (document.getElementById("packDesCreatePack").value) {
                for (let i = 0; i < 15; i++) {
                    promptsValuesArray.push(document.getElementById(`packPromptInput${i}`).value)
                    if (document.getElementById(`packPromptInput${i}`).value) {
                        if (i + 1 === 15) {
                            socket.emit("create-prompt-pack", {
                                prompts: promptsValuesArray,
                                name: document.getElementById("packNameCreatePack").value,
                                des: document.getElementById("packDesCreatePack").value
                            })
                        }
                    } else {
                        promptsValuesArray = new Array()
                        toast.success("You need 15 prompts!", {
                            icon: "❗"
                        })
                    }
                }
            } else {
                toast.success("Add a description!", {
                    icon: "❗"
                })
            }
        } else {
            toast.success("Pack needs a name!", {
                icon: "❗"
            })
        }
    }
    return (
        <div className="flex jcsb aic fdc fill">
            <div style={{ width: "100%", justifyContent: "flex-start" }} className='flex'>
                <h1>Create a new pack</h1>
            </div>
            <div className='flex jcsb' style={{ width: "100%", height: "80%" }}>
                <SettingsContainer>
                    <h2>Pack <br /> Settings</h2>
                    <br />
                    <br />
                    <Input id="packNameCreatePack" placeholder="Pack Name" />
                    <br />
                    <textarea id="packDesCreatePack" className='textarea' placeholder='Pack description' style={{ textAlign: "left", paddingLeft: 30, paddingTop: 20, paddingBottom: 20, lineHeight: 1.5 }} maxLength={235}></textarea>
                    <p style={{ opacity: .5, fontWeight: "bold", fontSize: 10, marginBottom: 5 }} className='fontOpen'>Your pack will be publicly vissible</p>
                    <Button size={"medium"} onClick={() => {
                        exportPack()
                    }}>Create Pack</Button>
                </SettingsContainer>
                <div style={{ marginLeft: 50, paddingBottom: 30 }}>
                    <SettingsContainer mgLeft>
                        <h2>Pack <br /> Prompts</h2>
                        <br />
                        <br />
                        <PromptInputMassRender />
                    </SettingsContainer>
                </div>
            </div>
        </div>
    )
}
