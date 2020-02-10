
const saveGame = winner, moves => {

        $.ajax({
            type:'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName("csrfmiddlewaretoken")[0].value,
                winner: winner
                moves: moves
            }
    }

