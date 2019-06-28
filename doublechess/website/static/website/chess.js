
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

// PossibleMoves class, containing legal moves and captures
class PossibleMoves {
    constructor() {
        this.moves = []
        this.captures = []

        this.addMove = id => {
            this.moves.push(id)
        }

        this.addCapture = id => {
            this.captures.push(id)
        }
    }
}



// Global variables 
var possibleMoves = new PossibleMoves()
//for use later
var currentPiece = null
var currentSquare = null;
var turn = colors.white


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

            let id = row_number + '' + col_number
            let square = document.getElementById(id)
            while(square.firstChild){
                square.removeChild(square.firstChild)
            }

            let piece = makePiece(chessboard[row_number][col_number])
            square.appendChild(piece)
        }
    }
}

// Takes object of the class piece and returns html element 
const makePiece = piece => {

    let htmlPiece = document.createElement('div')
    switch(piece.type){
        
        case types.none:
            break
        case types.pawn:
            htmlPiece.innerHTML = 'P'
            break
        case types.knight:
            htmlPiece.innerHTML = 'N'
            break
        case types.bishop:
            htmlPiece.innerHTML = 'B'
            break
        case types.rook:
            htmlPiece.innerHTML = 'R'
            break
        case types.queen:
            htmlPiece.innerHTML = 'Q'
            break
        case types.king:
            htmlPiece.innerHTML = 'K'
            break
    }

    if(piece.color === colors.white){
        htmlPiece.style.color = 'green'
    }else{
        htmlPiece.style.color = 'red'
    }
    htmlPiece.style.cursor = 'default'
    return htmlPiece
}


// Makes a chessboard table, and attaches it to the container chess-board
const renderChessboard = () => {

    let chess_board = document.getElementById('chess-board')
    while(chess_board.firstChild){
        chess_board.removeChild(chess_board.firstChild)
    }
    let color_counter = 0

    for(row_number = 0; row_number < 8; row_number++){
        
        let row = document.createElement('tr')

        for(col_number = 0; col_number < 8; col_number++){

            let square = document.createElement('td')
            square.className = 'chess-square'
            square.id = row_number + '' + col_number

            if(color_counter % 2 != 0){
                square.className += ' dark-square'
            }else{
                square.className += ' light-square'
            }
            
            square.addEventListener('click', () => {
                selectSquare(square.id)
            });

            row.appendChild(square)
            color_counter += 1
        }

        color_counter -= 1
        chess_board.appendChild(row)

    }

}
// This function is called when a square is clicked
const selectSquare = id => {
    clearMovesAndCaptures()
    currentPiece = getPieceById(id)
    if(currentPiece.type === types.none) {
        return;
    }
    /*
    if(currentPiece == null) {
        currentPiece = getPieceById(id)
        currentSquare = document.getElementById(id)
        if(currentPiece.type == 0) {
            currentPiece = null
            return
        }
        
    }
    */
    
    possibleMoves = getAvailableMoves(currentPiece, id)
    //console.log('moves : ' + moves)
    highlightMoves(possibleMoves.moves)
    highlightCaptures(possibleMoves.captures)

    //movePiece(id, currentPiece)

    

}
// This function highlights all legal moves
const highlightMoves = moves => {

    for (let item of moves) {
        console.log(item)
        let square = document.getElementById(item)
        let dot = document.createElement('div')
        dot.className = 'dot'
        dot.id = 'dot' + square.id
        square.appendChild(dot)
    }
}

// This function highlights all legal captures
const highlightCaptures = captures => {
    // color rim of square
    for (let item of captures) {
        /*
        console.log(item)
        let square = document.getElementById(item)
        let dot = document.createElement('div')
        dot.className = 'dot'
        dot.id = 'dot' + square.id
        square.appendChild(dot)
        */
    }
}

// Removes dots from board
const clearMovesAndCaptures = () => {


    for(let item of possibleMoves.captures){
        // do something
    }
    

    for (let item of possibleMoves.moves) {
        let square = document.getElementById(item)
        square.removeChild(document.getElementById('dot' + square.id))    
        
    }
}

// This function returns an object with possible moves and captures
const getAvailableMoves = (piece, id) => {
    let color = piece.color
    let row = parseInt(id.substring(0, 1))
    let column = parseInt(id.substring(1, 2))

    if(color === colors.white){
        switch(piece.type) {
            case types.pawn:
                return whitePawnMoves(row, column)
            
            case types.knight:
                return whiteKnightMoves(row, column)

            case types.bishop:
                return whiteBishopMoves(row, column)
            
            case types.rook:
                return whiteRookMoves(row, column)
            
            case types.queen:
                return whiteQueenMoves(row, column)
            
            case types.king:
                return whiteKingMoves(row, column)
        }
    }
    else{
        switch(piece.type) {
            case types.pawn:
                return blackPawnMoves(row, column)
            
            case types.knight:
                return blackKnightMoves(row, column)

            case types.bishop:
                return blackBishopMoves(row, column)
            
            case types.rook:
                return blackRookMoves(row, column)
            
            case types.queen:
                return blackQueenMoves(row, column)
            
            case types.king:
                return blackKingMoves(row, column)
        }
    }
        
}


    
const whitePawnMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    if(row === 6) {
        possibleMoves.addMove((row - 1) + '' + column)
        possibleMoves.addMove((row - 2) + '' + column)
    }
    
    return possibleMoves

}
const whiteKnightMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const whiteBishopMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const whiteRookMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const whiteQueenMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const whiteKingMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}

const blackPawnMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const blackKnightMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const blackBishopMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const blackRookMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const blackQueenMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}
const blackKingMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    return possibleMoves

}

// Returns an object of class Piece on a given id (square)
const getPieceById  = id => {
    let row = parseInt(id.substring(0, 1))
    let column = parseInt(id.substring(1, 2))
    return chessboard[row][column]
}



// Is called when the HTML content is done loading
window.addEventListener('DOMContentLoaded',  () => {
    renderChessboard()
    renderPieces()
    
});


