import React from 'react'

export default function Container(props) {
    const classes = Object.keys(props)
    const indexOfChildren = classes.indexOf("children")
    classes.splice(indexOfChildren, 1)
    return (
        <div id={props.id} className={[...classes].join(" ")}>
            {props.children}
        </div>
    )
}
