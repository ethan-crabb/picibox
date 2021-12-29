export default (navigate, route) => {
    document.getElementById("html").classList.add("op0")
    setTimeout(() => {
        navigate(route)
        setTimeout(() => {
            document.getElementById("html").classList.remove("op0")
        }, 250)
    }, 250)
}