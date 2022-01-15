import React, { useContext } from 'react'
import { useNavigate } from 'react-router';
import Button from '../Components/Button';
import RandomAvatar from '../Components/RandomAvatar';
import { GameContext } from '../Helpers/game';
import Nav from '../Helpers/Nav';

export default function PromptStore() {
    const gameInstane = useContext(GameContext)
    const navigate = useNavigate()
    return (
        <div className="flex jcc aic fdc fill">
            <div className="flex aic jcsb" style={{ width: "100%" }}>
                <div className="flex aic jcc" style={{ gap: 20 }}>
                    <RandomAvatar avatar={gameInstane.createCache ? gameInstane.createCache.avatar : 1} />
                    <h1>Pick a templete</h1>
                </div>
                <Button onClick={() => {
                    Nav(navigate, "/create-pack")
                }} size={"medium"}>+ Create</Button>
            </div>
        </div>
    )
}
