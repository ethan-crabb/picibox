import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from '../Helpers/game'
import { colourMap, fullColourMap, fileMap } from '../Helpers/avatar-bindings'
import Fade from 'react-reveal/Fade'
export default function RandomAvatar(props) {
    const gameInstance = useContext(GameContext)
    console.log(gameInstance)
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const reGenerate = () => {
        const generated = Math.floor(Math.random() * 6) + 1
        if (generated !== selectedAvatar) {
            setSelectedAvatar(generated)
            gameInstance.update({
                avatar: generated
            })
            window.sessionStorage.setItem("avatar", generated)
        } else {
            reGenerate()
        }
    }
    useEffect(() => {
        reGenerate()
    }, [])
    return (
        <div onClick={() => {
            if (props.regen) {
                reGenerate()
            }
        }} style={{ width: "fit-content", height: "fit-content", cursor: "pointer" }} className='flex aic jcc'>
            {selectedAvatar
                ? <Fade><img style={{ boxShadow: `0px 0px 15px ${colourMap[selectedAvatar.toString()]}`, border: `5px solid ${fullColourMap[selectedAvatar.toString()]}` }} className='avatar' src={fileMap[selectedAvatar.toString()]} key={selectedAvatar.toString()} alt="" /></Fade>
                : null
            }
        </div>
    )
}
