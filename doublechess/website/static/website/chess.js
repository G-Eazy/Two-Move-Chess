
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
    'black':1,
    'none':-1
}

// Piece class, containing fields type and color.
class Piece{
    constructor(type, color = colors.none){
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

    if(piece.color === colors.none){
        return htmlPiece
    }

    htmlPiece.className = 'chess-piece'

    if(piece.color === colors.white){
        switch(piece.type){
            case types.none:
                break
            case types.pawn:
                htmlPiece.className += ' white_pawn'
                break
            case types.knight:
                htmlPiece.className += ' white_knight'
                break
            case types.bishop:
                htmlPiece.className += ' white_bishop'
                break
            case types.rook:
                htmlPiece.className += ' white_rook'
                break
            case types.queen:
                htmlPiece.className += ' white_queen'
                break
            case types.king:
                htmlPiece.className += ' white_king'
                break
        }
    }else{
        switch(piece.type){
            case types.none:
                break
            case types.pawn:
                htmlPiece.className += ' black_pawn'
                break
            case types.knight:
                htmlPiece.className += ' black_knight'
                break
            case types.bishop:
                htmlPiece.className += ' black_bishop'
                break
            case types.rook:
                htmlPiece.className += ' black_rook'
                break
            case types.queen:
                htmlPiece.className += ' black_queen'
                break
            case types.king:
                htmlPiece.className += ' black_king'
                break
        }
    }
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
    console.log("id:" + id)
    console.log('\tmoves : ' + possibleMoves.moves)
    console.log('\tcaptures : ' + possibleMoves.captures)
    highlightMoves(possibleMoves.moves)
    highlightCaptures(possibleMoves.captures)

    //movePiece(id, currentPiece)

    

}
// This function highlights all legal moves
const highlightMoves = moves => {

    for (let item of moves) {
        let square = document.getElementById(item)
        let htmlMove = document.createElement('div')
        htmlMove.className = 'move'
        htmlMove.id = 'move' + square.id
        square.appendChild(htmlMove)
    }
}

// This function highlights all legal captures
const highlightCaptures = captures => {
    for (let item of captures) {
        let square = document.getElementById(item)
        let htmlCapture = document.createElement('div')
        htmlCapture.className = 'capture'
        htmlCapture.id = 'capture' + square.id
        square.appendChild(htmlCapture)
    }
}

// Removes moves and captures from board
const clearMovesAndCaptures = () => {
    for(let item of possibleMoves.captures){
        let square = document.getElementById(item)
        let child = document.getElementById('capture' + square.id)
        console.log(child)
        // try catch in case a highlight has been added to a square, and then a piece spawned / moved to that square,
        // then this function throws an error, same goes for the case below
        try {
            square.removeChild(child)  
        } catch (error) {
            
        }
    } 

    for (let item of possibleMoves.moves) {
        let square = document.getElementById(item)
        let child2 = document.getElementById('move' + square.id)
        console.log(child2)
        try {
            square.removeChild(child2)    
        } catch (error) {
            
        }
    }
    possibleMoves = new PossibleMoves()
}

// This function returns an object with possible moves and captures
const getAvailableMoves = (piece, id) => {
    let color = piece.color
    let row = parseInt(id.substring(0, 1))
    let column = parseInt(id.substring(1, 2))

    if(color === colors.white){
        switch(piece.type) {
            case types.pawn:
                console.log("WHITE PAWN")
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


// White pieces
const whitePawnMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // pieces in front of pawn
    let pieceInFront = chessboard[row-1][column]
    let pieceInFront2 = chessboard[row-2][column]
    console.log("row:" + row + "  column: " + column)
    console.log("piece in front type:" + pieceInFront.type)
    // moves
    if(row === 6) {
        if(pieceInFront.type === types.none) {
            console.log("Adding move + 1")
            possibleMoves.addMove((row - 1) + '' + column)
        }
        if(pieceInFront.type == types.none && pieceInFront2.type === types.none) {
            console.log("Adding move + 2")
            possibleMoves.addMove((row - 2) + '' + column)
        }
        
    }
    else {
        if(pieceInFront.type === types.none) {
            console.log("Adding move + 1")
            possibleMoves.addMove((row - 1) + '' + column)
        }
    }
    // pieces in front-right or front-left of pawn
    let pieceInFrontRight = null
    let pieceInFrontLeft = null
    if(column + 1 <= 7) {
        pieceInFrontRight = chessboard[row-1][column+1]    
    }
    if(column -1 >= 0) {
        pieceInFrontLeft = chessboard[row-1][column-1]
    }
    // captures
    if(pieceInFrontRight != null && pieceInFrontRight.color === colors.black) {
        console.log("Adding capture right")
        possibleMoves.addCapture((row-1) + "" + (column+1))
    }
    if(pieceInFrontLeft != null && pieceInFrontLeft.color === colors.black) {
        console.log("Adding capture left")
        possibleMoves.addCapture((row-1) + "" + (column-1))
    }
    
    return possibleMoves

}
const whiteKnightMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // Move and capture up right
    try {
        let piece = chessboard[row - 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column + 1))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row - 2) + "" + (column + 1))
        }
    } catch (error) {}
    // Move and capture up left
    try {
        let piece = chessboard[row - 2][column - 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column - 1))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row - 2) + "" + (column - 1))
        }
    } catch (error) {}

    // Move and capture down right
    try {
        let piece = chessboard[row + 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 2) + "" + (column + 1))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row + 2) + "" + (column + 1))
        }
    } catch (error) {}
    // Move and capture down left
    try {
        let piece = chessboard[row + 2][column - 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 2) + "" + (column - 1))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row + 2) + "" + (column - 1))
        }
    } catch (error) {}
    
    // Move and capture right up
    try {
        let piece = chessboard[row - 1][column + 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 1) + "" + (column + 2))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row - 1) + "" + (column + 2))
        }
    } catch (error) {}
    // Move and capture right down
    try {
        let piece = chessboard[row + 1][column + 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 1) + "" + (column + 2))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row + 1) + "" + (column + 2))
        }
    } catch (error) {}

    // Move and capture left up
    try {
        let piece = chessboard[row - 1][column - 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 1) + "" + (column - 2))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row - 1) + "" + (column - 2))
        }
    } catch (error) {}

    // Move and capture left down
    try {
        let piece = chessboard[row + 1][column - 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 1) + "" + (column - 2))
        }
        else if(piece.color === colors.black) {
            possibleMoves.addCapture((row + 1) + "" + (column - 2))
        }
    } catch (error) {}

    return possibleMoves

}
const whiteBishopMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // first diagonal movement and capture

    // default values
    let i = row
    let j = column
    console.log("going right upwards")
    if(row < 7) {
        for(i = row+1, j = column+1; i <= 7 && j <= 7; i++, j++) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up and right")
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i <= 7 && j <= 7 && chessboard[i][j].color === colors.black) {
            console.log("capture piece at " + i + "" + column)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    if(row > 0) {
        console.log("going left downwards")
        for(i = row-1, j = column-1; i >= 0 && j >= 0; i--, j--) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down left")
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i >= 0 && j >= 0 && chessboard[i][j].color === colors.black) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }

    // second diagonal movement and capture
    // default values
    i = row
    j = column
    if(column < 7) {
        console.log("going left upwards")

        console.log("i = " + i + "\tj = " + j)
        for(i = row-1, j = column+1; i >= 0 && j <= 7; i--, j++) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i >= 0 && j <= 7 && chessboard[i][j].color === colors.black) {
            console.log("capture piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    if(column > 0) {
        for(i = row+1, j = column-1; i <= 7 && j >= 0; i++, j--) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i <= 7 && j >= 0 && chessboard[i][j].color === colors.black) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    return possibleMoves

}
const whiteRookMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()

    // Row movement and capture
    let i = row
    console.log("going upwards")
    if(row < 7) {
        for(i = row+1; i <= 7; i++) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up")
                possibleMoves.addMove(i + "" + column)
            }
            
            
        }
        if(i <= 7 && chessboard[i][column].color === colors.black) {
            console.log("capture black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    if(row > 0) {
        console.log("going downwards")
        for(i = row-1; i >= 0; i--) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down")
                possibleMoves.addMove(i + "" + column)
            }
        }
        if(i >= 0 && chessboard[i][column].color === colors.black) {
            console.log("capture2 black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    // Column movement and capture
    let j = column
    if(column < 7) {
        console.log("j = " + j)
        for(j = column+1; j <= 7; j++) {
            if(chessboard[row][j].type != types.none) {
                console.log("break")
                break
            }
            else {
                possibleMoves.addMove(row + "" + j)
            }
            
            
        }
        if(j <= 7 && chessboard[row][j].color === colors.black) {
            console.log("capture white at " + j + "" + column)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    if(column > 0) {
        for(j = column-1; j >= 0; j--) {
            if(chessboard[row][j].type != types.none) {
                console.log("break2")
                break
            } 
            else {
                possibleMoves.addMove(row + "" + j)
            }
        }
        if(j >= 0 && chessboard[row][j].color === colors.black) {
            console.log("capture2 black at " + row + "" + j)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    return possibleMoves

}
const whiteQueenMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()

    // Row movement and capture
    let i = row
    console.log("going upwards")
    if(row < 7) {
        for(i = row+1; i <= 7; i++) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up")
                possibleMoves.addMove(i + "" + column)
            }
            
            
        }
        if(i <= 7 && chessboard[i][column].color === colors.black) {
            console.log("capture black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    if(row > 0) {
        console.log("going downwards")
        for(i = row-1; i >= 0; i--) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down")
                possibleMoves.addMove(i + "" + column)
            }
        }
        if(i >= 0 && chessboard[i][column].color === colors.black) {
            console.log("capture2 black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    // Column movement and capture
    let j = column
    if(column < 7) {
        console.log("j = " + j)
        for(j = column+1; j <= 7; j++) {
            if(chessboard[row][j].type != types.none) {
                console.log("break")
                break
            }
            else {
                possibleMoves.addMove(row + "" + j)
            }
            
            
        }
        if(j <= 7 && chessboard[row][j].color === colors.black) {
            console.log("capture black at " + j + "" + column)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    if(column > 0) {
        for(j = column-1; j >= 0; j--) {
            if(chessboard[row][j].type != types.none) {
                console.log("break2")
                break
            } 
            else {
                possibleMoves.addMove(row + "" + j)
            }
        }
        if(j >= 0 && chessboard[row][j].color === colors.black) {
            console.log("capture2 black at " + row + "" + j)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    

    // first diagonal movement and capture

    // default values
    i = row
    j = column
    console.log("going right upwards")
    if(row < 7) {
        for(i = row+1, j = column+1; i <= 7 && j <= 7; i++, j++) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up and right")
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i <= 7 && j <= 7 && chessboard[i][j].color === colors.black) {
            console.log("capture piece at " + i + "" + column)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    if(row > 0) {
        console.log("going left downwards")
        for(i = row-1, j = column-1; i >= 0 && j >= 0; i--, j--) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down left")
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i >= 0 && j >= 0 && chessboard[i][j].color === colors.black) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }

    // second diagonal movement and capture
    // default values
    i = row
    j = column
    if(column < 7) {
        console.log("going left upwards")

        console.log("i = " + i + "\tj = " + j)
        for(i = row-1, j = column+1; i >= 0 && j <= 7; i--, j++) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i >= 0 && j <= 7 && chessboard[i][j].color === colors.black) {
            console.log("capture piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    if(column > 0) {
        for(i = row+1, j = column-1; i <= 7 && j >= 0; i++, j--) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i <= 7 && j >= 0 && chessboard[i][j].color === colors.black) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    


    return possibleMoves

}

const blackKingMoves = (row, column) => {
    return kingMoves(row, column, colors.white)
}

const whiteKingMoves = (row, column) => {
    return kingMoves(row, column, colors.black)
}

const kingMoves = (row, column, otherColor) => {
    let possibleMoves = new PossibleMoves()
    for(let r = row -1; r <= row + 1; r++){
        for(let c = column - 1; c <= column + 1; c++){
            if(r === row && c === column){
                continue
            }
            try{
                let piece = chessboard[r][c]
                if(piece.color === colors.none){
                    possibleMoves.addMove(r + "" + c)
                }else if(piece.color === otherColor){
                    possibleMoves.addCapture(r + "" + c)
                }
            }catch(err){

            }
        }
    }
    return possibleMoves
}


// Black pieces
const blackPawnMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // pieces in front of pawn
    let pieceInFront = chessboard[row+1][column]
    let pieceInFront2 = chessboard[row+2][column]
    console.log("row:" + row + "  column: " + column)
    console.log("piece in front type:" + pieceInFront.type)
    // moves
    if(row === 1) {
        if(pieceInFront.type === types.none) {
            console.log("Adding move + 1")
            possibleMoves.addMove((row + 1) + '' + column)
        }
        if(pieceInFront.type == types.none && pieceInFront2.type === types.none) {
            console.log("Adding move + 2")
            possibleMoves.addMove((row + 2) + '' + column)
        }
        
    }
    else {
        if(pieceInFront.type === types.none) {
            console.log("Adding move + 1")
            possibleMoves.addMove((row + 1) + '' + column)
        }
    }
    // pieces in front-right or front-left of pawn
    let pieceInFrontRight = null
    let pieceInFrontLeft = null
    if(column - 1 >= 0) {
        pieceInFrontRight = chessboard[row+1][column-1]    
    }
    if(column + 1 <= 7) {
        pieceInFrontLeft = chessboard[row+1][column+1]
    }
    // captures
    if(pieceInFrontRight != null && pieceInFrontRight.color == colors.white) {
        console.log("Adding capture right")
        possibleMoves.addCapture((row+1) + "" + (column-1))
    }
    if(pieceInFrontLeft != null && pieceInFrontLeft.color == colors.white) {
        console.log("Adding capture left")
        possibleMoves.addCapture((row+1) + "" + (column+1))
    }
    
    return possibleMoves

}
const blackKnightMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // Move and capture up right
    try {
        let piece = chessboard[row - 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column + 1))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row - 2) + "" + (column + 1))
        }
    } catch (error) {}
    // Move and capture up left
    try {
        let piece = chessboard[row - 2][column - 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column - 1))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row - 2) + "" + (column - 1))
        }
    } catch (error) {}

    // Move and capture down right
    try {
        let piece = chessboard[row + 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 2) + "" + (column + 1))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row + 2) + "" + (column + 1))
        }
    } catch (error) {}
    // Move and capture down left
    try {
        let piece = chessboard[row + 2][column - 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 2) + "" + (column - 1))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row + 2) + "" + (column - 1))
        }
    } catch (error) {}
    
    // Move and capture right up
    try {
        let piece = chessboard[row - 1][column + 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 1) + "" + (column + 2))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row - 1) + "" + (column + 2))
        }
    } catch (error) {}
    // Move and capture right down
    try {
        let piece = chessboard[row + 1][column + 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 1) + "" + (column + 2))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row + 1) + "" + (column + 2))
        }
    } catch (error) {}

    // Move and capture left up
    try {
        let piece = chessboard[row - 1][column - 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 1) + "" + (column - 2))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row - 1) + "" + (column - 2))
        }
    } catch (error) {}

    // Move and capture left down
    try {
        let piece = chessboard[row + 1][column - 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 1) + "" + (column - 2))
        }
        else if(piece.color === colors.white) {
            possibleMoves.addCapture((row + 1) + "" + (column - 2))
        }
    } catch (error) {}

    return possibleMoves

}
const blackBishopMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // first diagonal movement and capture

    // default values
    let i = row
    let j = column
    console.log("going right upwards")
    if(row < 7) {
        for(i = row+1, j = column+1; i <= 7 && j <= 7; i++, j++) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up and right")
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i <= 7 && j <= 7 && chessboard[i][j].color === colors.white) {
            console.log("capture piece at " + i + "" + column)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    if(row > 0) {
        console.log("going left downwards")
        for(i = row-1, j = column-1; i >= 0 && j >= 0; i--, j--) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down left")
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i >= 0 && j >= 0 && chessboard[i][j].color === colors.white) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }

    // second diagonal movement and capture
    // default values
    i = row
    j = column
    if(column < 7) {
        console.log("going left upwards")

        console.log("i = " + i + "\tj = " + j)
        for(i = row-1, j = column+1; i >= 0 && j <= 7; i--, j++) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i >= 0 && j <= 7 && chessboard[i][j].color === colors.white) {
            console.log("capture piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    if(column > 0) {
        for(i = row+1, j = column-1; i <= 7 && j >= 0; i++, j--) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i <= 7 && j >= 0 && chessboard[i][j].color === colors.white) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    return possibleMoves

}
const blackRookMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()

    // Row movement and capture
    let i = row+1
    console.log("going upwards")
    if(row < 7) {
        for(i = row+1; i <= 7; i++) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up")
                possibleMoves.addMove(i + "" + column)
            }
            
            
        }
        if(i <= 7 && chessboard[i][column].color === colors.white) {
            console.log("capture black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    if(row > 0) {
        console.log("going downwards")
        for(i = row-1; i >= 0; i--) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down")
                possibleMoves.addMove(i + "" + column)
            }
        }
        if(i >= 0 && chessboard[i][column].color === colors.white) {
            console.log("capture2 black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    // Column movement and capture
    let j = column+1
    if(column < 7) {
        console.log("j = " + j)
        for(j = column+1; j <= 7; j++) {
            if(chessboard[row][j].type != types.none) {
                console.log("break")
                break
            }
            else {
                possibleMoves.addMove(row + "" + j)
            }
            
            
        }
        if(j <= 7 && chessboard[row][j].color === colors.white) {
            console.log("capture white at " + j + "" + column)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    if(column > 0) {
        for(j = column-1; j >= 0; j--) {
            if(chessboard[row][j].type != types.none) {
                console.log("break2")
                break
            } 
            else {
                possibleMoves.addMove(row + "" + j)
            }
        }
        if(j >= 0 && chessboard[row][j].color === colors.white) {
            console.log("capture2 black at " + row + "" + j)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    return possibleMoves

}
const blackQueenMoves = (row, column) => {
    let possibleMoves = new PossibleMoves()
    // Row movement and capture
    let i = row
    console.log("going upwards")
    if(row < 7) {
        for(i = row+1; i <= 7; i++) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up")
                possibleMoves.addMove(i + "" + column)
            }
            
            
        }
        if(i <= 7 && chessboard[i][column].color === colors.white) {
            console.log("capture black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    if(row > 0) {
        console.log("going downwards")
        for(i = row-1; i >= 0; i--) {
            console.log("i = " + i)
            if(chessboard[i][column].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down")
                possibleMoves.addMove(i + "" + column)
            }
        }
        if(i >= 0 && chessboard[i][column].color === colors.white) {
            console.log("capture2 black at " + i + "" + column)
            possibleMoves.addCapture(i + "" + column)
        }
    }
    // Column movement and capture
    let j = column
    if(column < 7) {
        console.log("j = " + j)
        for(j = column+1; j <= 7; j++) {
            if(chessboard[row][j].type != types.none) {
                console.log("break")
                break
            }
            else {
                possibleMoves.addMove(row + "" + j)
            }
            
            
        }
        if(j <= 7 && chessboard[row][j].color === colors.white) {
            console.log("capture white at " + j + "" + column)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    if(column > 0) {
        for(j = column-1; j >= 0; j--) {
            if(chessboard[row][j].type != types.none) {
                console.log("break2")
                break
            } 
            else {
                possibleMoves.addMove(row + "" + j)
            }
        }
        if(j >= 0 && chessboard[row][j].color === colors.white) {
            console.log("capture2 black at " + row + "" + j)
            possibleMoves.addCapture(row + "" + j)
        }
    }
    

    // first diagonal movement and capture

    // default values
    i = row
    j = column
    console.log("going right upwards")
    if(row < 7) {
        for(i = row+1, j = column+1; i <= 7 && j <= 7; i++, j++) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                console.log("adding move up and right")
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i <= 7 && j <= 7 && chessboard[i][j].color === colors.white) {
            console.log("capture piece at " + i + "" + column)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    if(row > 0) {
        console.log("going left downwards")
        for(i = row-1, j = column-1; i >= 0 && j >= 0; i--, j--) {
            console.log("i = " + i + "\tj = " + j)
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                console.log("adding move down left")
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i >= 0 && j >= 0 && chessboard[i][j].color === colors.white) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }

    // second diagonal movement and capture
    // default values
    i = row
    j = column
    if(column < 7) {
        console.log("going left upwards")

        console.log("i = " + i + "\tj = " + j)
        for(i = row-1, j = column+1; i >= 0 && j <= 7; i--, j++) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            }
            else {
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i >= 0 && j <= 7 && chessboard[i][j].color === colors.white) {
            console.log("capture piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    if(column > 0) {
        for(i = row+1, j = column-1; i <= 7 && j >= 0; i++, j--) {
            if(chessboard[i][j].type != types.none) {
                console.log("no available squares")
                break
            } 
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i <= 7 && j >= 0 && chessboard[i][j].color === colors.white) {
            console.log("capture2 piece at " + i + "" + j)
            possibleMoves.addCapture(i + "" + j)
        }
    }
    


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


