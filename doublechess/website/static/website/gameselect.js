window.addEventListener('DOMContentLoaded', () => {

    document.getElementById("time-form").addEventListener("submit", e => {
        e.preventDefault()
        $.ajax({
            type:'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName("csrfmiddlewaretoken")[0].value,
                starttime: document.getElementById("starttime").value,
                increment: document.getElementById("increment").value
            }
        });
    })

});