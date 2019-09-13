const renderChallenges = challenges => {
    console.log(challenges)
}

window.addEventListener('DOMContentLoaded', () => {

    let socket = null
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

    document.getElementById("time-form").addEventListener("submit", e => {
        e.preventDefault()
        $.ajax({
            type:'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName("csrfmiddlewaretoken")[0].value,
                starttime: document.getElementById("starttime").value,
                increment: document.getElementById("increment").value
            },

            success: data => {
                console.log(data)
                if(data.error !== undefined){
                    document.getElementById("message-box").style.color="red"
                    document.getElementById("message-box").innerHTML=data["error"]
                }else{
                    document.getElementById("message-box").style.color="black"
                    document.getElementById("message-box").innerHTML=data["success"]
                    renderChallenges(data["challenges"])
                }
            }

        });
        document.getElementById("starttime").value = ""
        document.getElementById("increment").value = ""
    })

});