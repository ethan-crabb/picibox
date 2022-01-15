import React, { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '../Components/Button'
import createPack from '../Helpers/createPack'
import { GameContext } from '../Helpers/game'

export default function CreatePack() {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    useEffect(() => {
        socket.on("create-prompt-pack", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                toast.success(`${responce.data} created!`,{
                    icon: "🗂️"
                })
            }
        })
    }, [])
    return (
        <div className="flex jcc aic fdc fill">
            <Button onClick={() => {
                createPack(socket)
            }}>Create Test</Button>
        </div>
    )
}
