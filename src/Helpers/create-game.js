import { toast } from "react-toastify"

export const createGame = (maxPlayersID, roundsID, nameID, avatar, socket) => {
    const maxPlayers = document.getElementById(maxPlayersID).value
    const rounds = document.getElementById(roundsID).value
    const name = document.getElementById(nameID).value

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