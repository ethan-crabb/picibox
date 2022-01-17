import { toast } from "react-toastify"
import copy from 'copy-to-clipboard';
import Nav from "./Nav";
import { useNavigate } from "react-router";

export const createGame = (maxPlayersID, roundsID, nameID, avatar, socket, test, promptList, promptPackID) => {
    const maxPlayers = test ? maxPlayersID : document.getElementById(maxPlayersID).value
    const rounds = test ? roundsID : document.getElementById(roundsID).value
    const name = test ? nameID : document.getElementById(nameID).value

    if (maxPlayers) {
        if (rounds && parseInt(rounds) !== 0 && parseInt(rounds) <= 15) {
            if (name) {
                toast.success("Creating...", {
                    icon: "⚙️",
                    hideProgressBar: true
                })
                socket.emit("create-game", {
                    gameSettings: {
                        maxPlayers: maxPlayers,
                        rounds: rounds,
                        prompts: promptList,
                        promptPackID: promptPackID
                    },
                    userSettings: {
                        name: name,
                        avatar: avatar
                    }
                })
            } else {
                toast.success("You gotta have a name!", {
                    icon: "❗"
                })
            }
        } else {
            toast.success("Rounds must be 0-15", {
                icon: "❗"
            })
        }
    } else {
        toast.success("Max players is empty!", {
            icon: "❗"
        })
    }
}