import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Connecting from '../Components/Connecting'
import Container from '../Components/Container'
import Lobby from '../Components/Lobby'
import RandomAvatar from '../Components/RandomAvatar'
import { GameContext } from '../Helpers/game'
import Nav from '../Helpers/Nav'
import Confetti from 'react-confetti'
import { RandomReveal } from 'react-random-reveal'
import Tada from 'react-reveal/Tada';
import Zoom from 'react-reveal/Zoom'
import Button from '../Components/Button'

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
    const [innerReviewStage, setInnerReviewStage] = useState(1)
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
        socket.on("continue-review", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                const { round, answer } = responce.data
                setRound(round)
                setAnswer(answer)
                setStage(1)
                setVotesRecceived(0)
            }
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
    const next = () => {
        if (answer + 1 > reviewData[round].answers.length) {
            if (round + 1 > reviewData.length) {
                toast.success("Game Over!", {
                    icon: "👋"
                })
            } else {
                socket.emit("continue-review", {
                    code: code,
                    newValues: {
                        round: round + 1,
                        answer: 0
                    }
                })
            }
        } else {
            socket.emit("continue-review", {
                code: code,
                newValues: {
                    round: round,
                    answer: answer + 1
                }
            })
        }
    }
    const PlayerVote = (localProps) => {
        // const playerArray = new Array()
        // for (let i = 0; i < lobby.length; i++) {
        //     if (lobby[i].id !== socket.id) {
        //         playerArray.push(<div className="flex aic jcc fdc">
        //             <RandomAvatar onClick={() => {
        //                 if (!localProps.disabled) {
        //                     setVoted(true)
        //                     socket.emit("vote-player", {
        //                         code: code,
        //                         playerVoteID: lobby[i].id,
        //                         answerInQuestion: reviewData[round].answers[answer].answer,
        //                         round: round
        //                     })
        //                 } else {
        //                     toast.success("You can't vote", {
        //                         icon: "❌"
        //                     })
        //                 }
        //             }} size={90} avatar={lobby[i].avatar} />
        //             <p style={{ marginTop: 15 }}>{lobby[i].name}</p>
        //         </div>)
        //     }
        // }
        return (
            // <div className={`flex aic jcc ${localProps.disabled ? "playerGridDisabled" : ""}`} style={{ flexWrap: "wrap", gap: 45 }}>
            //     {playerArray}
            // </div>
            <div style={{ opacity: `${props.disabled ? .5 : 1}` }}>
                <Lobby lobby={lobby} onClick={(i) => {
                    if (!localProps.disabled) {
                        setVoted(true)
                        socket.emit("vote-player", {
                            code: code,
                            playerVoteID: lobby[i].id,
                            answerInQuestion: reviewData[round].answers[answer].answer,
                            round: round
                        })
                        toast.success(`You voted ${lobby[i].name}`, {
                            icon: "✔️"
                        })
                    } else {
                        toast.success("You can't vote", {
                            icon: "❌"
                        })
                    }
                }} />
            </div>
        )
    }
    const VisualizePlayerScoreChanges = (props) => {
        const PlayersScoreChangeComponentArray = new Array()

        for (let i = 0; i < props.changeLog.length; i++) {
            PlayersScoreChangeComponentArray.push(
                <div className="flex aic jcc fdc">
                    <RandomAvatar size={90} avatar={props.changeLog[i].avatar} />
                    <p style={{ marginTop: 15 }}>{props.changeLog[i].name}</p>
                    <div style={{ backgroundColor: "#00B2FF", padding: "3px 10px", borderRadius: 10, color: "white", fontSize: 12, marginTop: 5 }} className='flex aic jcc'>
                        +500
                    </div>
                </div>
            )
        }
        return (
            <div className='flex aic jcc' style={{ flexWrap: "wrap", gap: 40 }}>
                {PlayersScoreChangeComponentArray}
            </div>
        )
    }
    if (reviewData) {
        if (stage === 1) {
            if (innerReviewStage === 1) {
                setTimeout(() => {
                    setInnerReviewStage(2)
                }, 3000)
                return (
                    <Zoom duration={500}>
                        <Container flex aic jcc fdc>
                            <Tada delay={1500}>
                                <h1>It's time to review your answers!</h1>
                            </Tada>
                        </Container>
                    </Zoom>
                )
            } else if (innerReviewStage === 2) {
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
                        <h3 style={{ fontSize: 25, color: "#000", textShadow: "0px 3px 0px #00B2FF" }}>{reviewData[round].answers[answer].id === socket.id ? "You wrote this one" : "Who wrote this?"}</h3>
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
            }
        } else if (stage === 2) {
            if (currentRoundAnswerData) {
                return (
                    <div className='flex aic jcc fdc' style={{ gap: 30, width: "100vw", height: "100vh" }}>
                        {/* <div style={{ position: "absolute" }}> */}
                        {/* <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                        /> */}
                        {/* </div> */}
                        <h1 className='flex aic jcc'>
                            {"It was "}
                            <RandomReveal isPlaying duration={2} characters={`${currentRoundAnswerData.player}`} />
                        </h1>
                        {/* <h1>It was {currentRoundAnswerData.player}</h1> */}
                        {/* <br /> */}
                        <p style={{ backgroundColor: "#00B2FF", padding: 10, borderRadius: 10, color: "white" }}>{currentRoundAnswerData.correctVotes}/{lobby.length - 1} people voted correctly</p>
                        <VisualizePlayerScoreChanges changeLog={currentRoundAnswerData.changeLog} />
                        <div style={{ position: "absolute", bottom: 50 }}>
                            {isHost
                                ? <Button size="medium" onClick={next}>Continue</Button>
                                : "Waiting to continue..."
                            }
                        </div>
                    </div>
                )
            } else {
                return (
                    <Connecting />
                )
            }
        } else if (stage === 3) {
            return (
                <Container flex aic jcc bgBlue fdc>

                </Container>
            )
        }
    } else {
        return (
            <Connecting />
        )
    }
}
