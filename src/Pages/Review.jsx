import React, { useContext, useEffect, useState } from 'react'
import Container from '../Components/Container'
import RandomAvatar from '../Components/RandomAvatar'
import { GameContext } from '../Helpers/game'

export default function Review(props) {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const code = props.code
    const lobby=props.lobby
    const [reviewData, setReviewData] = useState()
    const [round, setRound] = useState(0)
    const [answer, setAnswer] = useState(0)
    const [stage, setStage] = useState(1)
    const [votesRecceived, setVotesRecceived] = useState(0)
    useEffect(() => {
        socket.on("player-voted", () => {
            setVotesRecceived(votesRecceived + 1)
        })
    }, [])
    useEffect(() => {
        setReviewData(props.reviewData)
        console.log("Updated review data to", props.reviewData)
    }, [props.reviewData])
    // const PromptContainer = (props) => {
    //     return (
    //         <div className="promptContainer flex aic jcc">
    //             {props.children}
    //         </div>
    //     )
    // }
    const PlayerVote = () => {
        console.log(lobby)
        const playerArray = new Array()
        for (let i = 0; i < lobby.length; i++) {
            if (lobby[i].id !== socket.id) {
                playerArray.push(<div className="flex aic jcc fdc">
                <RandomAvatar onClick={() => {
                    socket.emit("vote-player", {
                        code: code,
                        playerVoteID: lobby[i].id
                    })
                }} size={90} avatar={lobby[i].avatar} />
                <p style={{marginTop: 15}}>{lobby[i].name}</p>
            </div>)
            }
        }
        return (
            <div className="flex aic jcc" style={{flexWrap: "wrap", gap: 20}}>
                {playerArray}
            </div>
        )
    }
    if (stage === 1) {
        return (
            <div style={{ position: "relative" }} className="flex aic jcc fdc">
                <div style={{
                    position: "absolute", top: 0,
                    left: 0
                }}>
                    {votesRecceived}/{props.lobby.length}
                </div>
                <h3>Who wrote this?</h3>
                <div className="flex aic jcc">
                    <Container promptContainer flex aic jcc>
                        {reviewData[round].prompt}
                    </Container>
                    <Container promptContainer flex aic jcc>
                        {reviewData[round].answers[answer]}
                    </Container>
                </div>
                <br />
                <PlayerVote />
            </div>
        )
    }
}
