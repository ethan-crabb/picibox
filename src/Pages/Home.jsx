import React, { useContext, useEffect } from 'react'
import Button from '../Components/Button'
import Container from '../Components/Container'
import Input from '../Components/Input'
import Link from '../Components/Link'
import RandomAvatar from '../Components/RandomAvatar'
import { toast } from 'react-toastify';
import { joinGame } from '../Helpers/join-game'
import { GameContext } from '../Helpers/game'
import Nav from '../Helpers/Nav'
import { useNavigate } from 'react-router'


export default function Home() {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const navigate = useNavigate()
    window.onload = () => {
        setTimeout(() => {
            toast.success('Welcome!', {
                icon: "👋"
            });
        }, 200)
    }
    useEffect(() => {
        socket.on("join-game", (responce) => {
            toast.dismiss()
            setTimeout(() => {
                if (responce.error) {
                    toast.success(responce.msg, {
                        icon: "❗",
                        hideProgressBar: true
                    })
                } else {
                    // gameInstance.update({ code: responce.data })
                    Nav(navigate, `/lobby/${responce.data}`)
                }
            }, 200)
        })
        setTimeout(() => {
            try {
                document.getElementById("join-name").focus()
            } catch {
                void 0
            }
        }, 200)
    }, [])
    return (
        <Container flex aic fill jcc>
            <Container flex fdc aic>
                <RandomAvatar regen />
                <div style={{ marginBottom: 20 }}></div>
                <Input maxLength={6} id="join-name" placeholder="Name" />
                <Input id="join-code" placeholder="Game Code" noMar />
                <br />
                <Button onClick={() => {
                    joinGame("join-name", "join-code", gameInstance.avatar, socket)
                }}>Join game</Button>
                <p style={{ fontSize: 12, marginTop: 5 }}>or <Link go="/create">create game</Link></p>
            </Container>
        </Container>
    )
}
