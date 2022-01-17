import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router';
import Button from '../Components/Button';
import RandomAvatar from '../Components/RandomAvatar';
import { GameContext } from '../Helpers/game';
import Nav from '../Helpers/Nav';
import Select from 'react-select'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Fade from 'react-reveal/Fade';
import { createGame } from '../Helpers/create-game'
import copy from 'copy-to-clipboard'

export default function PromptStore() {
    const gameInstane = useContext(GameContext)
    const socket = gameInstane.socket
    const navigate = useNavigate()
    const sortOptions = [
        { value: "likes", label: "Likes" },
        { value: "new", label: "New" },
        { value: "uses", label: "Downloads" }
    ]
    const [sort, setSort] = useState(sortOptions[0].value)
    const [rawPacks, setRawPacks] = useState([])
    useEffect(() => {
        socket.on("fetch-packs", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setRawPacks(responce.data)
            }
        })
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
    }, [])
    useEffect(() => {
        socket.emit("fetch-packs", {
            sort: sort
        })
    }, [sort])
    const packForward = (prompts) => {
        if (gameInstane.createCache) {
            const gicc = gameInstane.createCache
            createGame(gicc.maxPlayers, gicc.rounds, gicc.playerName, gicc.avatar, socket, true, prompts)
            // createGame.apply(this, )
        } else {
            Nav(navigate, "/create")
            toast.success("Must create game!", {
                icon: "❗"
            })
        }
    }
    const RenderPacksArray = (props) => {
        const packsArray = new Array()
        for (let i = 0; i < rawPacks.length; i++) {
            if (i === 0) {
                packsArray.push(
                    <div className='indiPackCode' onClick={() => {
                        const code = prompt("Input a pack code")
                    }}>
                        + Input Code
                    </div>
                )
            }
            packsArray.push(
                <Fade>
                    <Pack prompts={rawPacks[i].prompts} title={rawPacks[i].name} des={rawPacks[i].des} likes={rawPacks[i].likes} uses={rawPacks[i].uses} code={rawPacks[i].code} />
                </Fade>
            )
        }
        return (
            <>
                {packsArray}
            </>
        )
    }
    const Pack = (props) => {
        return (
            <div className='indiPack' onClick={() => {
                console.log("Recceived following prompts from parent:", props.prompts)
                packForward(props.prompts)
            }}>
                <h5>{props.title}</h5>
                <p>{props.des}</p>
                <div className='flex jcsb aic'>
                    <div className='flex' style={{ gap: 15, marginTop: 13 }}>
                        <div className='flex aic jcc' style={{ gap: 5 }}>
                            <svg className='bgChangeSVGpackIcon' xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" fill="#00B2FF"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" /></svg>
                            <span className='bgChangeSVGpackIcon' style={{ color: "#00B2FF", fontSize: 12 }}>{props.likes}</span>
                        </div>
                        <div className='flex aic jcc' style={{ gap: 5 }}>
                            <svg className='bgChangeSVGpackIcon' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="22px" viewBox="0 0 24 24" width="22px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" /></g></svg>
                            <span className='bgChangeSVGpackIcon' style={{ color: "#000", fontSize: 12 }}>{props.uses}</span>
                        </div>
                    </div>
                    <p style={{ position: "relative", top: 8 }}>{props.code}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="flex jcc aic fdc fill">
            <div className="flex aic jcc fdc" style={{ width: "100%" }}>
                <h1>Pick a prompt pack</h1>
                <div style={{ width: 170, marginTop: 30 }}>
                    <Select options={sortOptions} defaultValue={sortOptions[0]} onChange={(e) => { setSort(e.value) }} />
                </div>
                <div style={{ width: "100%", height: 500, backgroundColor: "#fff", marginTop: 20, gap: 30, flexWrap: "wrap", marginBottom: 30, overflowY: "scroll", paddingBottom: 10 }} className='flex packsGrid'>
                    <RenderPacksArray />
                </div>
                <div className='flex fdc aic jcc' style={{ gap: 10 }}>
                    or
                    <Button onClick={() => {
                        Nav(navigate, "/create-pack")
                    }}>Create your own</Button>
                </div>
            </div>
        </div>
    )
}
