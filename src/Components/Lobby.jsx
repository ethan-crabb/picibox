import React from 'react'
import RandomAvatar from "./RandomAvatar";

export default function Lobby(props) {
    const playersArray = new Array()
    for (let i = 0; i < props.lobby.length; i++) {
        playersArray.push(
            <div className="flex aic jcc fdc">
                <RandomAvatar onClick={() => {
                    if (props.onClick) {
                        props.onClick(i)
                    }
                }} size={90} avatar={props.lobby[i].avatar} />
                <p style={{ marginTop: 15 }}>{props.lobby[i].name}</p>
            </div>
        )
    }
    return (
        <div className="flex aic jcc" style={{ flexWrap: "wrap", gap: 40 }}>
            {playersArray}
        </div>
    )
}
