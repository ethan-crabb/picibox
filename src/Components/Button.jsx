import React from 'react'
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

export default function Button(props) {
    return (
        <AwesomeButton size={props.size} type="primary" onPress={props.onClick}>{props.children}</AwesomeButton>
        // <button onClick={props.onClick} style={{ background: props.col || "#000", boxShadow: `0px 0px 15px ${props.col || "rgba(0,0,0,.5)"}` }} className={`button`}>
        //     {props.children}
        // </button>
    )
}
