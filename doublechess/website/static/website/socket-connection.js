let socket = null

// let socket = null
if(window.location.href.includes("https")){
    socket = new WebSocket(window.location.href.replace("https", "wss"))
}else{
    socket = new WebSocket(window.location.href.replace("http", "ws"))
}

socket.onopen = e => {
    console.log("open", e)
}

socket.onmessage = e => {
    console.log("message", e)
}

socket.onerror = e => {
    console.log("error", e)
}

socket.onclose = e => {
    console.log("close", e)
}