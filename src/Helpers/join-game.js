import { toast } from "react-toastify"

export const joinGame = (nameID, codeID, avatar, socket) => {
    const name = document.getElementById(nameID).value
    const code = document.getElementById(codeID).value

    if (name) {
        if (name.length > 6) {
            toast.success("Name too long!", {
                icon: "❗"
            })
        } else {
            if (code) {
                toast.success("Connecting...", {
                    icon: "⚙️",
                    hideProgressBar: true
                })
                socket.emit("join-game", {
                    name: name,
                    code: code.toUpperCase(),
                    avatar: avatar
                })
            } else {
                toast.success("Enter a game code!", {
                    icon: "❗"
                })
            }
        }
    } else {
        toast.success("You gotta have a name!", {
            icon: "❗"
        })
    }
}