import React from 'react'

export default function Button(props) {
    return (
        <button onClick={props.onClick} style={{ background: props.col || "#000", boxShadow: `0px 0px 15px ${props.col || "rgba(0,0,0,.5)"}` }} className={`button`}>
            {props.children}
        </button>
    )
}
