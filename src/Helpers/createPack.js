export default (socket) => {
    socket.emit("create-prompt-pack", {
        prompts: [
            "Test prompt one",
            "Woah watch out for test prompt two",
            "And here we are with test prompt threeeeee",
            "The final prompt...test prompt...four"
        ],
        name: "Big Pack 5",
        des: "This pack has a lot to offer!"
    })
}