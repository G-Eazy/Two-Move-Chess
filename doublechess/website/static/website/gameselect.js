const renderChallenges = challenges => {
    container = document.getElementsByClassName("request-display-body")[0]
    sub_container = document.createElement("div")
    sub_container.className = "request-display-body"
    for(let username in challenges){
        starttime = challenges[username].starttime
        increment = challenges[username].increment
        element = document.createElement("div")
        element.innerHTML = username + ": (" + starttime +", "+increment + ")"
        sub_container.appendChild(element)
    }
    while(container.firstChild){
        container.firstChild.remove()
    }
    container.appendChild(sub_container)
}

window.addEventListener('DOMContentLoaded', () => {

    socket.onmessage = e => {

        message = JSON.parse(e["data"])

        if(message["type"] === "challenge"){
            renderChallenges(message["challenges"])
        }else if(message["type"] === "error"){
            document.getElementById("message-box").style.color="red"
            document.getElementById("message-box").innerHTML=message["text"]
        }else if(message["type"] === "message"){
            document.getElementById("message-box").style.color="black"
            document.getElementById("message-box").innerHTML=message["text"]
        }

    }

    socket.onopen = e => {
        socket.send(JSON.stringify({
            request_type: 'get_challenges'
        }))
    }

    document.getElementById("time-form").addEventListener("submit", e => {

        e.preventDefault()

        if(socket.readyState !== WebSocket.OPEN){
            document.getElementById("message-box").style.color="red"
            document.getElementById("message-box").innerHTML="could not connect to server"
        }else{
            socket.send(JSON.stringify({
                request_type: 'challenge',
                starttime: document.getElementById("starttime").value,
                increment: document.getElementById("increment").value
            }))
        }

        document.getElementById("starttime").value = ""
        document.getElementById("increment").value = ""
    })

});