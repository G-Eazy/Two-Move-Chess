// enum for types
const types = {
    'none':0,
    'pawn': 1,
    'knight':2,
    'bishop':3,
    'rook':4,
    'queen':5,
    'king':6
}

// enum for colors
const colors = {
    'white':0,
    'black':1
}

// Piece class, containing fields type and color.
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


// Renders the pieces the the chessboard datastructure to the html document
const renderPieces = () => {
    for(row_number = 0; row_number < 8; row_number++){
        for(col_number = 0; col_number < 8; col_number++){

            id = row_number + "" + col_number
            square = document.getElementById(id)
            while(square.firstChild){
                square.removeChild(square.firstChild)
            }

            piece = makePiece(chessboard[row_number][col_number])
            square.appendChild(piece)
        }
    }
}

// Takes object of the class piece and returns html element 
const makePiece = piece => {

    let htmlPiece = document.createElement("div")

    if(piece.color === null){
        return htmlPiece
    }

    htmlPiece.className = "chess-piece"

    if(piece.color === colors.white){
        switch(piece.type){
            case types.none:
                break
            case types.pawn:
                htmlPiece.className += " white_pawn"
                break
            case types.knight:
                htmlPiece.className += " white_knight"
                break
            case types.bishop:
                htmlPiece.className += " white_bishop"
                break
            case types.rook:
                htmlPiece.className += " white_rook"
                break
            case types.queen:
                htmlPiece.className += " white_queen"
                break
            case types.king:
                htmlPiece.className += " white_king"
                break
        }
    }else{
        switch(piece.type){
            case types.none:
                break
            case types.pawn:
                htmlPiece.className += " black_pawn"
                break
            case types.knight:
                htmlPiece.className += " black_knight"
                break
            case types.bishop:
                htmlPiece.className += " black_bishop"
                break
            case types.rook:
                htmlPiece.className += " black_rook"
                break
            case types.queen:
                htmlPiece.className += " black_queen"
                break
            case types.king:
                htmlPiece.className += " black_king"
                break
        }
    }
    return htmlPiece
}


// Makes a chessboard table, and attaches it to the container chess-board
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

// Is called when the HTML content is done loading
window.addEventListener('DOMContentLoaded',  () => {
    renderChessboard()
    renderPieces()
});