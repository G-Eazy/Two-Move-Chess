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

const sides = {
    'king':0,
    'queen':1,
    'other':-1
}

// enum for castling states
const castlingState = {
    "whiteKingMoved" : false,
    "whiteHRookMoved" : false,
    "whiteARookMoved" : false,
    "blackKingMoved" : false,
    "blackHRookMoved" : false,
    "blackARookMoved" : false
}



// Piece class, containing fields type and color.
class Piece {
    constructor(type, color = colors.none, side = sides.other, id=0){
        this.type = type
        this.color = color
        this.side = side
        this.id = id
        
        this.toString = () => {
            return "Piece of color " + this.color + " and type " + typeIdToTypeName(this.type) 
        }
    }
}

class Square {
    constructor(row, col) {
        this.row = row
        this.col = col

        this.id = row + "" + col

        this.equals = square => {
            return this.row === square.row && this.col === square.col
        }
        this.toString = () => {
            return "Square(" +  this.row + " " + this.col + ")"
        }

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
        this.removeMove = move => {
            if(this.moves.includes(move)) {
                this.moves.splice(this.moves.indexOf(move), 1)
            }
        }

        this.addCapture = id => {
            this.captures.push(id)
        }

        this.concatinate = object => {
            this.moves.push(...object.moves) 
            this.captures.push(...object.captures) 
        }

    }
}

// make static
class Timer {
    constructor() {
        this.timeWhite = 0
        this.timeBlack = 0
        this.prevTime = 0
        this.timerStarted = false
        
        this.getTimeWhite = () => {
            return Math.round(this.duration - this.timeWhite)
        }
        this.getTimeBlack = () => {
            return Math.round(this.duration - this.timeBlack)
        }
        this.setDuration = duration => {
            this.duration = duration*60*1000
        }
        this.setIncrement = increment => {
            this.increment = increment*1000 
        }
        this.startTimer = () => {
            this.prevTime = Date.now()
            this.timerStarted = true
            this.interval = setInterval(updateTime, 100)
        }
        this.stop = () => {
            clearInterval(this.interval)
        
        }
        // Adds time to class variables using unix time
        this.countDown = color => {
            if(! this.timerStarted) {
                return
            }
            let currentUnixTime = Date.now()
            let timeElapsed = currentUnixTime - this.prevTime

            if(color === colors.white) {
                this.timeWhite += timeElapsed
                if(this.timeWhite >= this.duration){
                    gameOver(colors.black, methods.time) 
                }
            }
            else if(color === colors.black) {
                this.timeBlack += timeElapsed
                if(this.timeBlack >= this.duration){
                    gameOver(colors.white, methods.time) 
                }
            }

            this.prevTime = currentUnixTime
        }
        // Increments time after turn
        this.changeTurn = color => {
            if(! this.timerStarted) {
                return
            }
            if(color === colors.white) {
                this.timeBlack -= this.increment
            }
            else {
                this.timeWhite -= this.increment
            }
        }

    }
}
// constants 

const initialChessboard = [
    [new Piece(4,1,1),new Piece(2,1), new Piece(3,1), new Piece(5,1),
        new Piece(6,1), new Piece(3,1), new Piece(2,1),new Piece(4,1,0)],
    [new Piece(1,1),new Piece(1,1),new Piece(1,1),new Piece(1,1),
        new Piece(1,1),new Piece(1,1),new Piece(1,1),new Piece(1,1)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0),new Piece(0)],
    [new Piece(1,0),new Piece(1,0),new Piece(1,0),new Piece(1,0),
        new Piece(1,0),new Piece(1,0),new Piece(1,0),new Piece(1,0)],
    [new Piece(4,0,1),new Piece(2,0), new Piece(3,0), new Piece(5,0),
        new Piece(6,0), new Piece(3,0), new Piece(2,0),new Piece(4,0,0)]
]

/*
    Takes a col value between 0 and 7 and returns the corresponding letter.

    col: number
*/

const getLetterFromCol = col => {
    let letter = null
    switch(col) {
        case 0:
            letter = 'a' 
            break
        case 1:
            letter = 'b' 
            break
        case 2:
            letter = 'c' 
            break
        case 3:
            letter = 'd' 
            break
        case 4:
            letter = 'e' 
            break
        case 5:
            letter = 'f' 
            break
        case 6:
            letter = 'g' 
            break
        case 7:
            letter = 'h' 
            break
    }

    return letter
}


/*
    Takes a chessboard and returns a copy

    chessboard: 2D array of pieces (objects)
*/
const copyChessboard = chessboard => {

    let newChessboard = []

    for(let row = 0; row < 8; row++){
        let newRow = []
        for(let col = 0; col < 8; col++){
            newRow.push(new Piece(chessboard[row][col].type, chessboard[row][col].color, chessboard[row][col].side, chessboard[row][col].id))
        }
        newChessboard.push(newRow)
    }
    return newChessboard
}

/*
    Generates and returns a new chessboardhistory

*/
const getNewChessboardHistory = () => {
    return [copyChessboard(initialChessboard)]
}



/*
    Takes a castlingstate and returns a copy

    cs: object, castlingstate
*/
const copyCastlingState = cs => {
    let newCS = {}
    newCS.whiteKingMoved = cs.whiteKingMoved
    newCS.whiteHRookMoved = cs.whiteHRookMoved
    newCS.whiteARookMoved = cs.whiteARookMoved
    newCS.blackKingMoved = cs.blackKingMoved
    newCS.blackHRookMoved = cs.blackHRookMoved
    newCS.blackARookMoved = cs.blackARookMoved
    return newCS
}

/*
    Generates a new castlingStates list
*/

const getNewCastlingStates = () => {
    return [copyCastlingState(castlingState)]
}

const getPromotionID = (color, type) => {
    let pieceCount = 0
    for(let row of chessboardHistory[chessboardHistory.length - 1]) {
        for(let piece of row) {
            if(piece.color == color && piece.type == type) {
                pieceCount ++
            } 
        } 
    }
    return pieceCount
}

/*
    Gets the move string, as to be displayed.

    piece: object, class:Piece
    squareFrom: object, class:Square
    squareTo: object, class:Square
    conditional: string (the extra component when multiple pieces can move to the same square)
    promotionPiece: object, class:Piece
    shortCastles: boolean
    longCastles: boolean
*/
const getMoveString = (piece, squareFrom, squareTo, capture, conditional=null, promotionPiece=null, shortCastles=false, longCastles=false) => {

    let moveString = ""
    
    if(shortCastles) {
        moveString += "O-O"
        return moveString
    }
    else if(longCastles) {
        moveString += "O-O-O"
        return moveString
    }

    if(piece.type === types.pawn && capture) {
        moveString += getLetterFromCol(squareFrom.col)
    }
    else if (piece.type != types.pawn){
        moveString += typeIdToTypeName(piece.type)
    }
    
    if(conditional != null) {
        moveString += conditional 
    }

    if(capture) {
        moveString += "x"
    }

    moveString += getLetterFromCol(squareTo.col) + (8 - squareTo.row)
    
    if(promotionPiece != null) {
        moveString += "=" + typeIdToTypeName(promotionPiece.type)
    }
    return moveString
}

/*
    Takes number from enum type and returns corresponding piece string

    type: number

*/
const typeIdToTypeName = type => {
    let retType = 0
    switch(type) {
        case 0:
            retType = 'none'
            break
        case 1:
            retType = 'P'
            break
        case 2:
            retType = 'N'
            break
        case 3:
            retType = 'B'
            break
        case 4:
            retType = 'R'
            break
        case 5:
            retType = 'Q'
            break
        case 6:
            retType = 'K'
            break
    }

    return retType
}

/*
    Checks if the squares have the same row
    square1: object, class: Square
    square2: object, class: Square
*/
const sameRow = (square1, square2) => {
    return square1.row === square2.row
}

/*
    Checks if the squares have the same column
    square1: object, class: Square
    square2: object, class: Square
*/
const sameColumn = (square1, square2) => {
    return square1.col === square2.col
}

/*
    checkes whether the square is contained in the possible moves

    square: object, class:Square
    possibleMoves: object, class:PossibleMoves
*/
const isPossibleMove = (square, possibleMoves) => {
    for(let elem of possibleMoves.moves) {
        if(square.id === elem) {
            return true
        } 
    }
    for(let elem of possibleMoves.captures) {
        if(square.id === elem) {
            return true
        } 
    }
    return false
}


/*
    Returns a list of squares. These squares belong to the pieces that 
    are of the color and type as specified by the parameters, and are not on the same 
    square as the parameter

    color: number, enum colors
    type: number, enum types
    square: object, class: Square
    chessboard: 2d array of pieces (objects)
*/

const getSameTypeSquares = (color, type, square, chessboard) => {
    let squares = []
    for(let row = 0; row < 8; row++){
        for(col = 0; col < 8; col++){
            let squareOther = new Square(row, col)
            let piece = chessboard[row][col]
            if(piece.color === color && piece.type === type && !square.equals(squareOther)){
                squares.push(squareOther)
            }
        }
    }
    return squares
}

/*  
    If another piece is found that move to squareTo, which is the same kind of piece
    as piece, then a conditional string is returned. For instance Neg4, 

    piece: object, class:Piece
    squareFrom: object, class:Square
    squareTo: object, class:Square
    chessboard: 2D array with Pieces (objects)
*/
const getAnotherPieceCanMoveString = (piece, squareFrom, squareTo, chessboardHistory, castlingStates, indexBoard, indexState) => {
    let chessboard = chessboardHistory[indexBoard]
    let castlingState = castlingStates[indexState]

    let string = ""
    let squares = getSameTypeSquares(piece.color, piece.type, squareFrom, chessboard)

    if(squares.length === 0) {
        return null
    }
    else {
        for(let square of squares) {
            let pieceMoves = getAvailableMoves(chessboardHistory, chessboard[square.row][square.col], square.row, square.col, castlingState, indexBoard)
            if(pieceMoves.moves.includes(squareTo.id) 
            || (pieceMoves.captures.includes(squareTo.id) && piece.type != types.pawn)) {

                if(sameRow(square, squareFrom)) {
                    string += getLetterFromCol(squareFrom.col)
                }
                else if(sameColumn(square, squareFrom)) {
                    string += (8 - squareFrom.row)
                }
                else {
                    string += getLetterFromCol(squareFrom.col)
                }
                return string
            }
        }
    }
    return null
}

/*
    Checks if the move that happened was a promotion.

    piece: object, class:Piece
    squareTo: object, class:Square
*/

const isPromotion = (piece, squareTo) => {
    if(piece.type === types.pawn && piece.color === colors.white && squareTo.row === 0){
        return true
    }else if(piece.type === types.pawn && piece.color === colors.black && squareTo.row === 7){
        return true
    }else{
        return false
    }
}

/*
    Returns true if the parameters constitutes a long castle

    piece: object, class:Piece
    squareFrom: object, class:Square
    squareTo: object, class:Square
*/
const isLongCastle = (piece, squareFrom, squareTo) => {
    return piece.type === types.king && squareFrom.col === 4 && squareTo.col === 2
}

/*
    Returns false if the parameters constitutes a short castle

    piece: object, class:Piece
    squareFrom: object, class:Square
    squareTo: object, class:Square
*/
const isShortCastle = (piece, squareFrom, squareTo) => {
    return piece.type === types.king && squareFrom.col === 4 && squareTo.col === 6
}

/*
    Returns object of class PossibleMoves, aka two lists, one of available
    captures and one of available moves.

    chessboard: 2D array of pieces (objects)
    piece: object, class:Piece
    row: number
    col: number
    cs: castlingState object
*/
const getAvailableMoves = (chessboardHistory, piece, row, column, castlingStatus, moveInFocus, normal=false) => {
    let chessboard = chessboardHistory[moveInFocus]
    let cs = castlingStatus[moveInFocus]

    let returnMoves = null
    let color = piece.color
    if(color === colors.white){
        switch(piece.type) {
            case types.pawn:
                returnMoves = whitePawnMoves(chessboard, row, column)
                break
            
            case types.knight:
                returnMoves = whiteKnightMoves(chessboard, row, column)
                break

            case types.bishop:
                returnMoves = whiteBishopMoves(chessboard, row, column)
                break
            
            case types.rook:
                returnMoves = whiteRookMoves(chessboard, row, column)
                break
            
            case types.queen:
                returnMoves = whiteQueenMoves(chessboard, row, column)
                break
            
            case types.king:
                returnMoves = whiteKingMoves(chessboard, row, column, cs)
                break
        }
    }
    else{
        switch(piece.type) {
            case types.pawn:
                returnMoves = blackPawnMoves(chessboard, row, column)
                break
            
            case types.knight:
                returnMoves = blackKnightMoves(chessboard, row, column)
                break

            case types.bishop:
                returnMoves = blackBishopMoves(chessboard, row, column)
                break
            
            case types.rook:
                returnMoves = blackRookMoves(chessboard, row, column)
                break
            
            case types.queen:
                returnMoves = blackQueenMoves(chessboard, row, column)
                break
            
            case types.king:
                returnMoves = blackKingMoves(chessboard, row, column, cs)
                break
        }
    }
    // Removing non-state-changing move
    if(normal == true && moveInFocus > 0) {
        if(moveInFocus % 4 === 0 || moveInFocus % 4 === 2) {
            let illegalMove = getIllegalMove(chessboardHistory, row, column)
            if(illegalMove != null) {
                returnMoves.removeMove(illegalMove)
            }
        }
    }
    return returnMoves
}

/*
    Returns a string of coordinates that represent the illegal move
    i.e. "06" or null if no illegal moves are attempted

    chessboardhistory: Array of chessboards
    row: number
    col: number
*/
    
const getIllegalMove = (chessboardHistory, row, col) => {
    let illegalMove = null
    let previousPosition = null
    let capture = false
    let previousState = chessboardHistory[chessboardHistory.length-2]
    let currentState = chessboardHistory[chessboardHistory.length-1]
    let pieceThatMoves = null
    
    // Loop through the chessboard and look for the differences from last state
    // to next-to last state (two squares will be changed)
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            let piece1 = previousState[i][j]
            let piece2 = currentState[i][j]
            // Mismatch here
            if(piece1.type != piece2.type || piece1.color != piece2.color) {
                // This is the square that contains the piece's recent coordinates (aka squareTo)
                if(previousState[i][j].type != types.none) {
                    pieceThatMoves = previousState[i][j]
                    previousPosition = i + "" + j
                }

            } 
        } 
    }
    // Case of capture, then setting a boolean for allowing piece to return to previous coordinate
    if(previousState[row][col].type != types.none && previousState[row][col].color != pieceThatMoves.color) {
        capture = true
    }
    // Checking if the piece currently selected is the same piece that moved most recently, in which case i dissalow the return square.
    if(currentState[row][col].type == pieceThatMoves.type && currentState[row][col].color == pieceThatMoves.color && currentState[row][col].id == pieceThatMoves.id && capture == false) {
        illegalMove = previousPosition
    }
    return illegalMove
}


const whitePawnMoves = (chessboard, row, column) => {
    return pawnMoves(chessboard, row, column, colors.black)
}

const whiteKnightMoves = (chessboard, row, column) => {
   return knightMoves(chessboard, row, column, colors.black) 
}

const whiteBishopMoves = (chessboard, row, column) => {
    return bishopMoves(chessboard, row, column, colors.black)
}

const whiteRookMoves = (chessboard, row, column) => {
    return rookMoves(chessboard, row, column, colors.black)
}

const whiteQueenMoves = (chessboard, row, column) => {
    return queenMoves(chessboard, row, column, colors.black)
}

const whiteKingMoves = (chessboard, row, column, cs) => {
    return kingMoves(chessboard, row, column, colors.black, cs)
}



// Black pieces

const blackPawnMoves = (chessboard, row, column) => {
    return pawnMoves(chessboard, row, column, colors.white)
}

const blackKnightMoves = (chessboard, row, column) => {
    return knightMoves(chessboard, row, column, colors.white)
}

const blackBishopMoves = (chessboard, row, column) => {
    return bishopMoves(chessboard, row, column, colors.white)
}

const blackRookMoves = (chessboard, row, column) => {
    return rookMoves(chessboard, row, column, colors.white)
}

const blackQueenMoves = (chessboard, row, column) => {
    return queenMoves(chessboard, row, column, colors.white)
}

const blackKingMoves = (chessboard, row, column, cs) => {
    return kingMoves(chessboard, row, column, colors.white, cs)
}



const pawnMoves = (chessboard, row, column, otherColor) => {
    let possibleMoves = new PossibleMoves()
    // black / white variables
    // pieces in front of pawn
    let rowIndex1, rowIndex2 = 0    // default value
    let startRow = 0
    let pieceFrontLeftIndex, pieceInFrontRightIndex = []
    if(otherColor === colors.black) {
        rowIndex1 = row - 1
        rowIndex2 = row - 2
        startRow = 6
        pieceFrontRightIndex = [row-1, column+1]
        pieceFrontLeftIndex = [row-1, column-1]
    }
    else {
        rowIndex1 = row + 1
        rowIndex2 = row + 2
        startRow = 1
        pieceFrontRightIndex = [row+1, column-1]
        pieceFrontLeftIndex = [row+1, column+1]
    }

    let pieceInFront = chessboard[rowIndex1][column]
    // moves
    if(row === startRow) {
        let pieceInFront2 = chessboard[rowIndex2][column]
        if(pieceInFront.type === types.none) {
            possibleMoves.addMove((rowIndex1) + '' + column)
        }
        if(pieceInFront.type == types.none && pieceInFront2.type === types.none) {
            possibleMoves.addMove((rowIndex2) + '' + column)
        }
        
    }
    else {
        if(pieceInFront.type === types.none) {
            possibleMoves.addMove((rowIndex1) + '' + column)
        }
    }
    
    // pieces in front-right or front-left of pawn
    let pieceInFrontRight = null
    let pieceInFrontLeft = null
    if(column + 1 <= 7) {
        if(otherColor === colors.black) {
            pieceInFrontRight = chessboard[pieceFrontRightIndex[0]][pieceFrontRightIndex[1]]    
        } else {
            pieceInFrontLeft = chessboard[pieceFrontLeftIndex[0]][pieceFrontLeftIndex[1]]
        }
    }
    if(column - 1 >= 0) {
        if(otherColor === colors.black) {
            pieceInFrontLeft = chessboard[pieceFrontLeftIndex[0]][pieceFrontLeftIndex[1]]
        } else {
            pieceInFrontRight = chessboard[pieceFrontRightIndex[0]][pieceFrontRightIndex[1]]    
        }
    }
   
    // captures
    if(pieceInFrontRight != null && pieceInFrontRight.color === otherColor) {
        possibleMoves.addCapture((pieceFrontRightIndex[0] + "" + pieceFrontRightIndex[1]))
    }
    if(pieceInFrontLeft != null && pieceInFrontLeft.color === otherColor) {
        possibleMoves.addCapture(pieceFrontLeftIndex[0] + "" + pieceFrontLeftIndex[1])
    }
    
    return possibleMoves

}


const knightMoves = (chessboard, row, column, otherColor) => {
    let possibleMoves = new PossibleMoves()
    
    let possibleSquares = [new Square(row-2, column+1), new Square(row-2, column-1), 
                            new Square(row+2, column+1), new Square(row+2, column -1), 
                            new Square(row-1, column+2), new Square(row+1, column+2),
                            new Square(row-1, column-2), new Square(row+1, column-2)]

    for(let square of possibleSquares){
        try{
            let piece = chessboard[square.row][square.col]
            if(piece.color === colors.none) {
                possibleMoves.addMove(square.row + "" + square.col)
            }
            else if(piece.color === otherColor) {
                possibleMoves.addCapture(square.row + "" + square.col)
            }
        }catch(error){
        }
    }
    return possibleMoves
}

const bishopMoves = (chessboard, row, column, otherColor) => {
    let possibleMoves = new PossibleMoves()
    // first diagonal movement and capture

    // default values
    let i = row
    let j = column
    if(row < 7) {
        for(i = row+1, j = column+1; i <= 7 && j <= 7; i++, j++) {
            if(chessboard[i][j].type != types.none) {
                break
            }
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i <= 7 && j <= 7 && chessboard[i][j].color === otherColor) {
            possibleMoves.addCapture(i + "" + j)
        }
    }
    if(row > 0) {
        for(i = row-1, j = column-1; i >= 0 && j >= 0; i--, j--) {
            if(chessboard[i][j].type != types.none) {
                break
            } 
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i >= 0 && j >= 0 && chessboard[i][j].color === otherColor) {
            possibleMoves.addCapture(i + "" + j)
        }
    }

    // second diagonal movement and capture
    // default values
    i = row
    j = column
    if(column < 7) {
        for(i = row-1, j = column+1; i >= 0 && j <= 7; i--, j++) {
            if(chessboard[i][j].type != types.none) {
                break
            }
            else {
                possibleMoves.addMove(i + "" + j)
            }
            
            
        }
        if(i >= 0 && j <= 7 && chessboard[i][j].color === otherColor) {
            possibleMoves.addCapture(i + "" + j)
        }
    }
    
    if(column > 0) {
        for(i = row+1, j = column-1; i <= 7 && j >= 0; i++, j--) {
            if(chessboard[i][j].type != types.none) {
                break
            } 
            else {
                possibleMoves.addMove(i + "" + j)
            }
        }
        if(i <= 7 && j >= 0 && chessboard[i][j].color === otherColor) {
            possibleMoves.addCapture(i + "" + j)
       }
    }
    return possibleMoves
}


const rookMoves = (chessboard, row, column, otherColor) => {
    let possibleMoves = new PossibleMoves()

    // Row movement and capture
    let i = row
    if(row < 7) {
        for(i = row+1; i <= 7; i++) {
            if(chessboard[i][column].type != types.none) {
                break
            }
            else {
                possibleMoves.addMove(i + "" + column)
            }
        }
        if(i <= 7 && chessboard[i][column].color === otherColor) {
            possibleMoves.addCapture(i + "" + column)
        }
    }
    if(row > 0) {
        for(i = row-1; i >= 0; i--) {
            if(chessboard[i][column].type != types.none) {
                break
            } 
            else {
                possibleMoves.addMove(i + "" + column)
            }
        }
        if(i >= 0 && chessboard[i][column].color === otherColor) {
            possibleMoves.addCapture(i + "" + column)
        }
    }
    // Column movement and capture
    let j = column
    if(column < 7) {
        for(j = column+1; j <= 7; j++) {
            if(chessboard[row][j].type != types.none) {
                break
            }
            else {
                possibleMoves.addMove(row + "" + j)
            }
            
            
        }
        if(j <= 7 && chessboard[row][j].color === otherColor) {
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    if(column > 0) {
        for(j = column-1; j >= 0; j--) {
            if(chessboard[row][j].type != types.none) {
                break
            } 
            else {
                possibleMoves.addMove(row + "" + j)
            }
        }
        if(j >= 0 && chessboard[row][j].color === otherColor) {
            possibleMoves.addCapture(row + "" + j)
        }
    }
    
    return possibleMoves

}

const queenMoves = (chessboard, row, column, otherColor) => {
    let possibleRmoves = rookMoves(chessboard, row, column, otherColor)
    let possibleBmoves = bishopMoves(chessboard, row, column, otherColor)
    possibleRmoves.concatinate(possibleBmoves)
    return possibleRmoves
}

// cs = castlingState
const kingMoves = (chessboard, row, column, otherColor, cs) => {
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

    // White king short castling
    if(otherColor === colors.black && !cs.whiteKingMoved && !cs.whiteHRookMoved 
        && chessboard[7][5].type === types.none && chessboard[7][6].type === types.none
        && chessboard[7][7].color === colors.white
        && chessboard[7][7].type === types.rook
        && chessboard[7][7].side === sides.king) {
        possibleMoves.addMove(7 + "" + 6)
    }
    // White king long castling
    if(otherColor === colors.black && !cs.whiteKingMoved && !cs.whiteARookMoved 
        && chessboard[7][1].type === types.none && chessboard[7][2].type === types.none
        && chessboard[7][3].type === types.none
        && chessboard[7][0].color === colors.white
        && chessboard[7][0].type === types.rook
        && chessboard[7][0].side === sides.queen) {
        possibleMoves.addMove(7 + "" + 2)
    }
    
    // Black king short castling
    if(otherColor === colors.white && !cs.blackKingMoved && !cs.blackHRookMoved 
        && chessboard[0][5].type === types.none && chessboard[0][6].type === types.none
        && chessboard[0][7].color === colors.black
        && chessboard[0][7].type === types.rook
        && chessboard[0][7].side === sides.king) {
        possibleMoves.addMove(0 + "" + 6)
    }
    // Black king long castling
    if(otherColor === colors.white && !cs.blackKingMoved && !cs.blackARookMoved 
        && chessboard[0][1].type === types.none && chessboard[0][2].type === types.none
        && chessboard[0][3].type === types.none
        && chessboard[0][0].color === colors.black
        && chessboard[0][0].type === types.rook
        && chessboard[0][0].side === sides.queen) {
        possibleMoves.addMove(0 + "" + 2)
    }
    
    return possibleMoves
}

/*  
    Moves the piece from squareFrom to squareTo on the chessboard. 
    Changes the castling state and the chessboard.

    chessboard: 2D array of pieces (objects)
    cs: castling state object
    squareFrom: object, class:Square
    squareTo: object, class:Square
    capture: boolean
*/
const movePiece = (chessboard, cs ,squareFrom, squareTo, promotionPiece) =>{
    
    let piece = chessboard[squareFrom.row][squareFrom.col]
    chessboard[squareFrom.row][squareFrom.col] = new Piece(0)
        

    if(promotionPiece !== null){
        chessboard[squareTo.row][squareTo.col] = promotionPiece
        return
    }
   
    // Castling state
    if(piece.type === types.king) {
        if(piece.color === colors.white) {
            if(! cs.whiteKingMoved && squareTo.col === 6) {
                chessboard[7][6] = piece
                chessboard[7][5] = chessboard[7][7]
                chessboard[7][7] = new Piece(0)
                cs.whiteHRookMoved = true
                cs.whiteKingMoved = true
                return
            }
            else if(! cs.whiteKingMoved && squareTo.col === 2) {
                chessboard[7][2] = piece
                chessboard[7][3] = chessboard[7][0]
                chessboard[7][0] = new Piece(0)
                cs.whiteARookMoved = true
                cs.whiteKingMoved = true
                return
            }
            cs.whiteKingMoved = true
        }
        else {
            if(! cs.blackKingMoved && squareTo.col === 6) {
                chessboard[0][6] = piece
                chessboard[0][5] = chessboard[0][7]
                chessboard[0][7] = new Piece(0)
                cs.blackHRookMoved = true
                cs.blackKingMoved = true
                return
            
            }
            else if(! cs.blackKingMoved && squareTo.col === 2) {
                chessboard[0][2] = piece
                chessboard[0][3] = chessboard[0][0]
                chessboard[0][0] = new Piece(0)
                cs.blackARookMoved = true
                cs.blackKingMoved = true
                return
            }
            cs.blackKingMoved = true
        }

    } 
    else if(piece.type === types.rook) {
        if(piece.color === colors.white) {
            if(squareFrom.col === 0 && squareFrom.row === 7) {
                cs.whiteARookMoved = true
            }
            else if(squareFrom.col === 7 && squareFrom.row === 7) {
                cs.whiteHRookMoved = true
            }
        }
        else {
            if(squareFrom.col === 0 && squareFrom.row === 0) {
                cs.blackARookMoved = true
            }
            else if(squareFrom.col === 7 && squareFrom.row === 0) {
                cs.blackHRookMoved = true
            }
        
        }
    }
    
    chessboard[squareTo.row][squareTo.col] = piece
    return
}
