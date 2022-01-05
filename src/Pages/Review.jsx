import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Connecting from '../Components/Connecting'
import Container from '../Components/Container'
import RandomAvatar from '../Components/RandomAvatar'
import { GameContext } from '../Helpers/game'
import Nav from '../Helpers/Nav'

export default function Review(props) {
    const gameInstance = useContext(GameContext)
    const socket = gameInstance.socket
    const code = props.code
    const [lobby, setLobby] = useState(props.lobby)
    const [reviewData, setReviewData] = useState(null)
    const [round, setRound] = useState(0)
    const [answer, setAnswer] = useState(0)
    const [stage, setStage] = useState(1)
    const [votesRecceived, setVotesRecceived] = useState(0)
    const [voted, setVoted] = useState(false)
    const [isHost, setIsHost] = useState(false)
    const [currentRoundAnswerData, setCurrentRoundAnswerData] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        console.log(lobby)
        for (let i = 0; i < lobby.length; i++) {
            console.log("Looping through lobby")
            if (lobby[i].host) {
                if (lobby[i].id === socket.id) {
                    setIsHost(true)
                    console.log("Found host, is player")
                } else {
                    console.log("Found host, not player")
                }
            } else {
                console.log("Itteration was not host")
            }
        }
        console.log(lobby, code, reviewData)
        socket.on("player-voted", (responce) => {
            console.log("Recceived player-voted")
            setVotesRecceived(responce.data)
        })
        socket.on("vote-reveal", (responce) => {
            setStage(2)
            setCurrentRoundAnswerData(responce.data)
        })
        socket.on("vote-player", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            }
        })
        socket.on("player-left", () => {
            socket.emit("get-lobby", (responce) => {
                if (responce.error) {
                    toast.success("Internal Error!", {
                        icon: "❗"
                    })
                } else {
                    setLobby(responce.data)
                }
            })
        })
        socket.on("end-game", (responce) => {
            toast.success(responce.data, {
                icon: "👋"
            })
            setTimeout(() => {
                Nav(navigate, "/")
            }, 2000);
        })
    }, [])
    useEffect(() => {
        setReviewData(props.reviewData)
        if (Array.isArray(props.reviewData)) {
            try {
                console.log(reviewData[round].answers[answer])
            } catch {
                console.log("Failed")
            }
        }
        console.log("Updated review data to", props.reviewData)
    }, [props.reviewData])
    const PlayerVote = (localProps) => {
        console.log(lobby)
        const playerArray = new Array()
        for (let i = 0; i < lobby.length; i++) {
            if (lobby[i].id !== socket.id) {
                playerArray.push(<div className="flex aic jcc fdc">
                    <RandomAvatar onClick={() => {
                        if (!localProps.disabled) {
                            setVoted(true)
                            socket.emit("vote-player", {
                                code: code,
                                playerVoteID: lobby[i].id,
                                answerInQuestion: reviewData[round].answers[answer].answer,
                                round: round
                            })
                        } else {
                            toast.success("You can't vote", {
                                icon: "❌"
                            })
                        }
                    }} size={90} avatar={lobby[i].avatar} />
                    <p style={{ marginTop: 15 }}>{lobby[i].name}</p>
                </div>)
            }
        }
        return (
            <div className={`flex aic jcc ${localProps.disabled ? "playerGridDisabled" : ""}`} style={{ flexWrap: "wrap", gap: 45 }}>
                {playerArray}
            </div>
        )
    }
    if (reviewData) {
        if (stage === 1) {
            return (
                <div style={{ position: "relative", gap: 30 }} className="flex aic jcc fdc">
                    <div style={{
                        position: "absolute", top: 0,
                        left: 0,
                        textAlign: "center",
                        fontSize: 30
                    }} className='flex aic jcc fdc'>
                        {votesRecceived}/{props.lobby.length - 1}
                        {/* <span style={{ fontSize: 10, lineHeight: 2, maxWidth: 90 }}>
                            votes recceived
                        </span> */}
                    </div>
                    <h3 style={{ fontSize: 20 }}>{reviewData[round].answers[answer].id === socket.id ? "You wrote this one" : "Who wrote this?"}</h3>
                    <br />
                    <div className="flex aic jcc" style={{ gap: 20 }}>
                        <Container promptContainer flex aic jcc>
                            {reviewData[round].prompt}
                        </Container>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" /></svg>
                        <Container promptContainer flex aic jcc>
                            {reviewData[round].answers[answer].answer}
                        </Container>
                    </div>
                    <br />
                    <PlayerVote disabled={reviewData[round].answers[answer].id === socket.id || voted} />
                    {reviewData[round].answers[answer].id === socket.id
                        ? null
                        : <div style={{ backgroundColor: "#00B2FF", color: "white", textAlign: "center", padding: 10, borderRadius: 10 }}>
                            Click to vote
                        </div>
                    }
                </div>
            )
        } else if (stage === 2) {
            if (currentRoundAnswerData) {
                return (
                    <div>
                        <h1>It was {currentRoundAnswerData.player}</h1>
                        <p style={{ backgroundColor: "#00B2FF", padding: 10, borderRadius: 10 }}>{currentRoundAnswerData.correctVotes}/{lobby.length - 1} people voted correctly</p>
                    </div>
                )
            } else {
                return (
                    <Connecting />
                )
            }
        }
    } else {
        return (
            <Connecting />
        )
    }
}
