import React from 'react'
import RandomAvatar from "./RandomAvatar";
import Fade from 'react-reveal/Fade'
import { useMediaQuery } from 'react-responsive'

export default function Lobby(props) {
    const displayPlayerStack = useMediaQuery({
        query: "(max-width: 550px)"
    })
    const playersArray = new Array()
    root: for (let i = 0; i < props.lobby.length; i++) {
        console.log(displayPlayerStack, i)
        if ((displayPlayerStack && !props.overflow) && i + 1 === 3) {
            playersArray.push(
                <div className="flex aic jcc fdc">
                    <RandomAvatar onClick={() => {
                        if (props.onClick && !props.disabled) {
                            props.onClick(i)
                        }
                    }} size={90} avatar={props.lobby[i].avatar} />
                    <p style={{ marginTop: 15 }}>{props.lobby[i].name}</p>
                </div>
            )
            playersArray.push(
                <div className='flex aic jcc' style={{ width: 90, height: 90, borderRadius: "50%", backgroundColor: "#EAEAEA", color: "rgba(0,0,0,.5)", position: "relative", bottom: 20 }}>
                    +{props.lobby.length - 3}
                </div>
            )
            break root
        } else {
            playersArray.push(
                <div className="flex aic jcc fdc">
                    <RandomAvatar onClick={() => {
                        if (props.onClick && !props.disabled) {
                            props.onClick(i)
                        }
                    }} size={90} avatar={props.lobby[i].avatar} />
                    <p style={{ marginTop: 15 }}>{props.lobby[i].name}</p>
                </div>
            )
        }
    }
    const LobbyContainer = () => {
        return (
            <div className="flex aic jcc" style={{ flexWrap: "wrap", gap: 40, zIndex: 50, maxWidth: "100vw" }}>
                {playersArray}
            </div>
        )
    }
    if (props.disabled) {
        return (
            <div style={{ position: "relative" }}>
                <div className="flex aic jcc" style={{ position: "absolute", backgroundColor: "rgba(255, 255, 255, .7)", width: "100%", height: "100%", zIndex: 100, color: "#00B2FF", textShadow: "0px 3px 0px #000" }}>
                    <Fade bottom>
                        <div style={{ position: "relative", bottom: 10, fontSize: 20 }}>
                            {props.disabledReason || null}
                        </div>
                    </Fade>
                </div>
                <LobbyContainer />
            </div>
        )
    } else {
        return (
            <LobbyContainer />
        )
    }
}
