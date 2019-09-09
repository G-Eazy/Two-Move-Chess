const renderChallenges = challenges => {
    console.log(challenges)
}

window.addEventListener('DOMContentLoaded', () => {

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