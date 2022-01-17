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
import Wobble from 'react-reveal/Wobble';
import Fade from 'react-reveal/Fade'

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
    const [currentLobbyScoreData, setCurrentLobbyScoreData] = useState(new Array())
    const [innerReviewStage, setInnerReviewStage] = useState(1)
    const [innerWinnerStage, setInnerWinnerStage] = useState(1)
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
            setCurrentLobbyScoreData(responce.data.lobbyScores)
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
                if (!responce.error) {
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
                setVoted(false)
            }
        })
        socket.on("reveal-scores-screen", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setStage(3)
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
        socket.on("reveal-winners", (responce) => {
            if (responce.error) {
                toast.success(responce.msg, {
                    icon: "❗"
                })
            } else {
                setStage(4)
            }
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
        console.log("Ans check:", answer, reviewData[round].answers.length)
        if (answer + 1 >= reviewData[round].answers.length) {
            console.log("Passed")
            console.log(round, reviewData.length)
            if (round + 1 >= reviewData.length) {
                if (isHost) {
                    socket.emit("reveal-winners", {
                        code: code
                    })
                }
            } else {
                console.log("Continue review")
                socket.emit("continue-review", {
                    code: code,
                    newValues: {
                        round: round + 1,
                        answer: 0
                    }
                })
            }
        } else {
            console.log("Continue review 2")
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
            // <div style={{ opacity: `${props.disabled ? .5 : 1}` }}>
            <Lobby disabledReason={localProps.disabled ? (reviewData[round].answers[answer].id === socket.id ? "You wrote this one 🔒" : "You've voted 🔒") : null} disabled={localProps.disabled} lobby={lobby} onClick={(i) => {
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
            // </div>
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
                try {
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
                } catch {
                    console.log("Caught error in innerReviewStage 2")
                }
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
                                ? <Button size="medium" onClick={() => {
                                    socket.emit("reveal-scores-screen", {
                                        code: code
                                    })
                                }}>Continue</Button>
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
            const componentArray = new Array()
            setTimeout(() => {
                document.getElementById("scoresContainer").classList.add("heightFull")
            }, 1500)
            for (let i = 0; i < currentLobbyScoreData.length; i++) {
                console.log(currentLobbyScoreData[i].score)
                componentArray.push(
                    <div className='flex aic jcc' style={{ color: "white", marginBottom: 5, gap: 5 }}>
                        <p>{`${currentLobbyScoreData[i].player}: `}</p>
                        <p>{currentLobbyScoreData[i].score}</p>
                    </div>
                )
            }
            return (
                <div className={"flex aic jcc full fdc heightZero bgBlue"} id="scoresContainer">
                    <h1 style={{ color: "white" }}>Scores:</h1>
                    <br />
                    {componentArray}
                    <div style={{ position: "absolute", bottom: 50, color: "white" }}>
                        {isHost
                            ? <Button size="medium" onClick={next}>Continue</Button>
                            : "Waiting to continue..."
                        }
                    </div>
                </div>
            )
        } else if (stage === 4) {
            let currentHighest = 0
            const scorePositions = {
                first: undefined,
                second: undefined,
                third: undefined
            }
            const mapToLobby = (playerID, cb) => {
                lobbyLoop: for (let i = 0; i < lobby.length; i++) {
                    if (lobby[i].id === playerID) {
                        cb(lobby[i])
                        break lobbyLoop
                    } else {
                        if (i + 1 === lobby.length) {
                            cb(null)
                        }
                    }
                }
            }
            const malubleScoresArray = [...currentLobbyScoreData]
            first: for (let i = 0; i < malubleScoresArray.length; i++) {
                if (malubleScoresArray[i].score > currentHighest) {
                    currentHighest = malubleScoresArray[i].score
                    console.log("Passing " + malubleScoresArray[i].id + " to", lobby)
                    mapToLobby(malubleScoresArray[i].id, (playerObj) => {
                        scorePositions.first = { ...playerObj, index: i, score: malubleScoresArray[i].score }
                    })
                } else if (i + 1 === malubleScoresArray.length && !scorePositions.first) {
                    mapToLobby(malubleScoresArray[i].id, (playerObj) => {
                        scorePositions.first = { ...playerObj, index: i, score: malubleScoresArray[i].score }
                    })
                }
                if (i + 1 === malubleScoresArray.length) {
                    currentHighest = 0
                    malubleScoresArray.splice(scorePositions.first.index, 1)

                    seccond: for (let x = 0; x < malubleScoresArray.length; x++) {
                        if (malubleScoresArray[x].score > currentHighest) {
                            currentHighest = malubleScoresArray[x].score
                            mapToLobby(malubleScoresArray[x].id, (playerObj) => {
                                scorePositions.second = { ...playerObj, index: x, score: malubleScoresArray[x].score }
                            })
                        } else if (x + 1 === malubleScoresArray.length && !scorePositions.second) {
                            mapToLobby(malubleScoresArray[x].id, (playerObj) => {
                                scorePositions.second = { ...playerObj, index: x, score: malubleScoresArray[x].score }
                            })
                        }
                        if (x + 1 === malubleScoresArray.length) {
                            currentHighest = 0
                            malubleScoresArray.splice(scorePositions.second.index, 1)

                            third: for (let q = 0; q < malubleScoresArray.length; q++) {
                                if (malubleScoresArray[q].score > currentHighest) {
                                    currentHighest = malubleScoresArray[q].score
                                    mapToLobby(malubleScoresArray[q].id, (playerObj) => {
                                        scorePositions.third = { ...playerObj, index: q, score: malubleScoresArray[q].score }
                                    })
                                } else if (q + 1 === malubleScoresArray.length && !scorePositions.third) {
                                    mapToLobby(malubleScoresArray[q].id, (playerObj) => {
                                        scorePositions.third = { ...playerObj, index: q, score: malubleScoresArray[q].score }
                                    })
                                }
                                if (q + 1 === malubleScoresArray.length) {
                                    console.log("Resolved scores object:", scorePositions)
                                    break third
                                }
                            }
                            break seccond
                        }
                    }
                    break first
                }
            }
            const WinnerAvatarAndScore = (props) => {
                console.log(props)
                return (
                    <div className='flex aic jcc fdc' style={{ gap: 10, fontSize: `${props.winner ? 20 : "12px"}`, position: "relative", marginBottom: `${props.winner ? 100 : 0}` }}>
                        <RandomAvatar style={{ boxShadow: `${props.winner ? "0px 0px 20px rgb(255,205,25)" : "none"}` }} size={props.winner ? 150 : 90} avatar={props.avatar} />
                        <div className='flex aic jcc fdc' style={{ gap: 5 }}>
                            <p>{props.name}</p>
                            <p className='bgBlue' style={{ color: "white", padding: 10, borderRadius: 10 }}>Score: {props.score}</p>
                        </div>
                    </div>
                )
            }
            if (innerWinnerStage === 1) {
                setTimeout(() => {
                    setInnerWinnerStage(2)
                }, 5000)
                return (
                    <div className='flex aic jcc full'>
                        <Fade duration={400}>
                            <Wobble delay={3000}>
                                <h1>We have a <RandomReveal isPlaying duration={2} characters={`Winner`} /></h1>
                            </Wobble>
                        </Fade>
                    </div>
                )
            } else {
                return (
                    <div className='flex aic jcc fdc' style={{ gap: 30, width: "100vw", height: "100vh" }}>
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                        />
                        <h1>Congrats {scorePositions.first.name}!</h1>
                        <br />
                        <Fade bottom>
                            <div className='flex aic jcc' style={{ gap: 60 }}>
                                <WinnerAvatarAndScore name={scorePositions.second.name} score={scorePositions.second.score} avatar={scorePositions.second.avatar} />
                                <WinnerAvatarAndScore name={scorePositions.first.name} score={scorePositions.first.score} avatar={scorePositions.first.avatar} winner />
                                <WinnerAvatarAndScore name={scorePositions.third.name} score={scorePositions.third.score} avatar={scorePositions.third.avatar} />
                            </div>
                        </Fade>
                        <br />
                        <div className='flex aic jcc fdc' style={{ gap: 20 }}>
                            <p>Did you like this pack?</p>
                            <div className='flex aic jcsb' style={{ paddingTop: 0, width: 100 }}>
                                <div className='likeContainer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#49FFA8"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" /></svg>
                                </div>
                                <div className='likeContainer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FF3F3F"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm0 12l-4.34 4.34L12 14H3v-2l3-7h9v10zm4-12h4v12h-4z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    } else {
        return (
            <Connecting />
        )
    }
}
