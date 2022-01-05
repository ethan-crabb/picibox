import { toast } from "react-toastify"
import copy from 'copy-to-clipboard';

export const createGame = (maxPlayersID, roundsID, nameID, avatar, socket, test) => {
    const maxPlayers = test ? maxPlayersID : document.getElementById(maxPlayersID).value
    const rounds = test ? roundsID : document.getElementById(roundsID).value
    const name = test ? nameID : document.getElementById(nameID).value

    if (maxPlayers) {
        if (rounds) {
            if (name) {
                toast.success("Creating...", {
                    icon: "⚙️",
                    hideProgressBar: true
                })
                socket.emit("create-game", {
                    gameSettings: {
                        maxPlayers: maxPlayers,
                        rounds: rounds
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
            toast.success("Rounds is empty!", {
                icon: "❗"
            })
        }
    } else {
        toast.success("Max players is empty!", {
            icon: "❗"
        })
    }
}