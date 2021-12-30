import { toast } from "react-toastify"

export default (gameCode, lobby, socket) => {
    for (let i = 0; i < lobby.length; i++) {
        if (lobby[i].host) {
            if (socket.id === lobby[i].id) {
                if (lobby.length >= 3) {
                    socket.emit("start-game", {
                        code: gameCode
                    })
                } else {
                    toast.success("Not enough players!", {
                        icon: "❗"
                    })
                }
            } else {
                toast.success("Your not the owner!", {
                    icon: "❗"
                })
            }
        }
    }
}