import React from 'react'
import RandomAvatar from "./RandomAvatar";
import Fade from 'react-reveal/Fade'

export default function Lobby(props) {
    const playersArray = new Array()
    for (let i = 0; i < props.lobby.length; i++) {
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
    const LobbyContainer = () => {
        return (
            <div className="flex aic jcc" style={{ flexWrap: "wrap", gap: 40, zIndex: 50}}>
                {playersArray}
            </div>
        )
    }
    if (props.disabled) {
        return (
            <div style={{position: "relative"}}>
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
