import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from '../Helpers/game'
import { colourMap, fullColourMap, fileMap } from '../Helpers/avatar-bindings'
import Fade from 'react-reveal/Fade'
export default function RandomAvatar(props) {
    const customStyle = props.style || {}
    const gameInstance = useContext(GameContext)
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const reGenerate = () => {
        const generated = selectedAvatar ? (selectedAvatar + 1 > 6 ? 1 : selectedAvatar + 1) : Math.floor(Math.random() * 6) + 1
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
        if (!props.avatar) {
            reGenerate()
        } else {
            setSelectedAvatar(props.avatar)
        }
    }, [])
    return (
        <div id={props.id} onClick={() => {
            if (props.onClick) {
                props.onClick()
            } else {
                if (props.regen) {
                    reGenerate()
                }
            }
        }} style={{ width: "fit-content", height: "fit-content", cursor: "pointer" }} className={`avatarContainer ${props.onClick || props.regen ? "clickEffect" : ""} flex aic jcc`}>
            {selectedAvatar
                ? <Fade><img style={{ boxShadow: `0px 0px 15px ${colourMap[selectedAvatar.toString()]}`, border: `5px solid ${fullColourMap[selectedAvatar.toString()]}`, width: props.size || 110, height: props.size || 110, ...customStyle }} className='avatar' src={fileMap[selectedAvatar.toString()]} key={selectedAvatar.toString()} alt="Player avatar" /></Fade>
                : null
            }
        </div>
    )
}
