import React from 'react'
import { useNavigate } from 'react-router'
import Nav from '../Helpers/Nav'

export default function Link(props) {
    const navigate = useNavigate()
    return (
        <span onClick={() => {
            Nav(navigate, props.go)
        }} style={{ color: "#00B2FF", cursor: "pointer" }}>{props.children}</span>
    )
}
