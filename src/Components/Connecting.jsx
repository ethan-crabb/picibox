import React from 'react'
import { colourMap, fileMap, fullColourMap } from "../Helpers/avatar-bindings";
import Container from './Container';
import RandomAvatar from './RandomAvatar';

export default function Connecting() {
    return (
        <Container fill flex aic jcc fdc>
            <RandomAvatar />
            <h3 style={{ marginTop: 10, fontWeight: "lighter" }}>
                Connecting...
            </h3>
        </Container>
    )
}
