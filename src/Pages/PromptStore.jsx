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
    const [packPreview, setPackPreview] = useState(null)
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
                        Nav(navigate, `/lobby/${responce.data}`)
                    }, 500)
                }, 1000)
            }
        })
        socket.on("fetch-pack", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setPackPreview({
                    prompts: responce.data.prompts,
                    title: responce.data.name,
                    des: responce.data.des,
                    likes: responce.data.likes,
                    uses: responce.data.uses,
                    code: responce.data.code
                })
                // packForward(responce.data.prompts, responce.data.code)
            }
        })
    }, [])
    useEffect(() => {
        socket.emit("fetch-packs", {
            sort: sort
        })
    }, [sort])
    const packForward = (prompts, code) => {
        if (gameInstane.createCache) {
            const gicc = gameInstane.createCache
            createGame(gicc.maxPlayers, gicc.rounds, gicc.playerName, gicc.avatar, socket, true, prompts, code)
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
                        socket.emit("fetch-pack", {
                            packCode: code.toUpperCase()
                        })
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
                setPackPreview({
                    ...props
                })
                // packForward(props.prompts, props.code)
            }}>
                <h5>{props.title}</h5>
                <p>{props.des.length > 90 ? props.des.substring(0, 90) + "..." : props.des}</p>
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
    const PackPreviewModal = () => {
        const [promptPreviewPrompt, setPromptPreviewPrompt] = useState(0)
        return (
            <div style={{ position: "absolute", width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,.5)", zIndex: 1000 }} className='flex aic jcc packModal'>
                <Fade duration={400}>
                    <div style={{ backgroundColor: "#fff", width: "55%", height: "70%", minHeight: 300, maxHeight: 400, width: 700, padding: 20, borderRadius: 20 }} className='packPrev'>
                        <div style={{ width: "100%", height: "85%", padding: 35 }} className='flex jcsb fdc packPad'>
                            <div className='flex jcsb aic'>
                                <h5 style={{ margin: 0, fontSize: 20 }}>{packPreview.title}</h5>
                                <svg className='antiRight' style={{ position: "relative", right: 65, opacity: .5, cursor: "pointer" }} onClick={() => setPackPreview(null)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                            </div>
                            <br />
                            <div className='flex aic jcsb' style={{ flex: 1, gap: 0 }}>
                                <div style={{ height: "100%" }} className='flex fdc'>
                                    <p style={{ width: 450, flex: 1, maxHeight: 100, }}>{packPreview.des.length > 235 ? packPreview.des.substring(0, 235) + "..." : packPreview.des}</p>
                                    <div style={{ flex: 1, width: 450 }} className='flex aic miniPromptController'>
                                        <div className='miniPromptContainer flex aic jcc' style={{ width: 200, height: 100, fontWeight: "normal", fontSize: 12 }}>
                                            <p style={{ maxWidth: 200, opacity: .7 }}>
                                                {packPreview.prompts[promptPreviewPrompt].length > 70 ? packPreview.prompts[promptPreviewPrompt].substring(0, 70) + "..." : packPreview.prompts[promptPreviewPrompt]}
                                            </p>
                                        </div>
                                        <svg onClick={() => {
                                            if (packPreview.prompts[promptPreviewPrompt + 1]) {
                                                setPromptPreviewPrompt(promptPreviewPrompt + 1)
                                            } else {
                                                setPromptPreviewPrompt(0)
                                            }
                                        }} xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" /></g></svg>
                                    </div>
                                </div>
                                <div style={{ position: "relative", right: 65, top: 117 }}>
                                    <div className='flex aic jcc fdc' style={{ gap: 0, marginBottom: 10, opacity: .8 }}>
                                        <svg className='bgChangeSVGpackIcon' xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#00B2FF"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" /></svg>
                                        <span className='bgChangeSVGpackIcon' style={{ color: "#00B2FF", fontSize: 15, userSelect: "none" }}>{packPreview.likes || 0}</span>
                                    </div>
                                    <div className='flex aic jcc fdc' style={{ gap: 0, marginTop: 10, opacity: .6 }}>
                                        <svg className='bgChangeSVGpackIcon' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="30px" viewBox="0 0 24 24" width="30px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" /></g></svg>
                                        <span className='bgChangeSVGpackIcon' style={{ color: "#000", fontSize: 15, userSelect: "none" }}>{packPreview.uses || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <br style={{ userSelect: "none" }} />
                            <Button size={"small"} onClick={() => {
                                packForward(packPreview.prompts, packPreview.code)
                            }}>Use</Button>
                        </div>
                    </div>
                </Fade>
            </div>
        )
    }
    return (
        <div className="flex jcc aic fdc fill">
            {packPreview
                ? <PackPreviewModal />
                : null
            }
            <div className="flex aic jcc fdc" style={{ width: "100%" }}>
                <h1 style={{ textAlign: "center", lineHeight: 1 }}>Pick a prompt pack</h1>
                <div style={{ width: 170, marginTop: 30 }}>
                    <Select options={sortOptions} defaultValue={sortOptions[0]} onChange={(e) => { setSort(e.value) }} />
                </div>
                <div id="packSelectContainer" style={{ width: "100%", height: "fit-content", maxHeight: "500", backgroundColor: "#fff", marginTop: 20, gap: 30, flexWrap: "wrap", marginBottom: 30, overflowY: "scroll", paddingBottom: 10 }} className='flex jcc packsGrid'>
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
