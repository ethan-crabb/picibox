import React from 'react'

export default function Input(props) {
    return (
        <input maxLength={props.maxLength} value={props.value} onChange={(e) => props.onChange ? props.onChange(e) : void 0} id={props.id} type={props.type || "text"} className={`input ${props.noMar ? "margin0" : ""}`} placeholder={props.placeholder} />
    )
}
