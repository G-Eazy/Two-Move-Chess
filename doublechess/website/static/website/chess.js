const types = {
    'none':0,
    'pawn': 1,
    'knight':2,
    'bishop':3,
    'rook':4,
    'queen':5,
    'king':6
}

const colors = {
    'white':0,
    'black':1
}

class Piece{
    constructor(type, color = null){
        this.type = type
        this.color = color
    }
}

const chessboard = [
    [new Piece(4,1),new Piece(2,1), new Piece(3,1), new Piece(5,1),
        new Piece(6,1), new Piece(3,1), new Piece(2,1),new Piece(4,1)],
    [new Piece(1,1),new Piece(1,1),new Piece(1,1),new Piece(1,1),
        new Piece(1,1),new Piece(1,1),new Piece(1,1),new Piece(1,1)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(1,0),new Piece(1,0),new Piece(1,0),new Piece(1,0),
        new Piece(1,0),new Piece(1,0),new Piece(1,0),new Piece(1,0)],
    [new Piece(4,0),new Piece(2,0), new Piece(3,0), new Piece(5,0),
        new Piece(6,0), new Piece(3,0), new Piece(2,0),new Piece(4,0)]
]

const renderPieces = () => {

    for(row_number = 0; row_number < 8; row_number++){
        for(col_number = 0; col_number < 8; col_number++){

            id = row_number + "" + col_number
            square = document.getElementById(id)
            while(square.firstChild){
                square.removeChild(square.firstChild)
            }

            piece = document.createElement("div")
            switch(chessboard[row_number][col_number].type){

                case types.none:
                    break
                case types.pawn:
                    piece.innerHTML = "P"
                    break
                case types.knight:
                    piece.innerHTML = "N"
                    break
                case types.bishop:
                    piece.innerHTML = "B"
                    break
                case types.rook:
                    piece.innerHTML = "R"
                    break
                case types.queen:
                    piece.innerHTML = "Q"
                    break
                case types.king:
                    piece.innerHTML = "K"
                    break
            }

            if(chessboard[row_number][col_number].color === colors.white){
                piece.style.color = "green"
            }else{
                piece.style.color = "red"
            }
            piece.style.cursor = "default"

            square.appendChild(piece)
        }
    }
}

const renderChessboard = () => {

    let chess_board = document.getElementById("chess-board")
    while(chess_board.firstChild){
        chess_board.removeChild(chess_board.firstChild)
    }
    color_counter = 0

    for(row_number = 0; row_number < 8; row_number++){
        
        row = document.createElement("tr")

        for(col_number = 0; col_number < 8; col_number++){

            square = document.createElement("td")
            square.className = "chess-square"
            square.id = row_number + "" + col_number

            if(color_counter % 2 != 0){
                square.className += " dark-square"
            }else{
                square.className += " light-square"
            }
            
            row.appendChild(square)
            color_counter += 1
        }

        color_counter -= 1
        chess_board.appendChild(row)

    }

}

window.addEventListener('DOMContentLoaded', () => {
    renderChessboard()
    renderPieces()
});