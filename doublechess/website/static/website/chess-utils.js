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
class Piece {
    constructor(type, color = colors.none){
        this.type = type
        this.color = color
    }
}

class Square {
    constructor(row, col) {
        this.row = row
        this.col = col

        this.id = row + "" + col
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

        this.concatinate = object => {
            this.moves.push(...object.moves) 
            this.captures.push(...object.captures) 
        }

    }
}

// constants 

const initialChessboard = [
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


// functions

const copyChessboard = chessboard => {

    let newChessboard = []

    for(let row = 0; row < 8; row++){
        let newRow = []
        for(let col = 0; col < 8; col++){
            newRow.push(new Piece(chessboard[row][col].type, chessboard[row][col].color))
        }
        newChessboard.push(newRow)
    }
    return newChessboard
}

// untested
const getNewChessboardHistory = () => {
    return [copyChessboard(initialChessboard)]
}


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
        moveString += getLetterFromId(squareFrom.id)
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

    moveString += getLetterFromId(squareTo.id) + (8 - parseInt(squareTo.id.substring(0, 1)))
    
    if(promotionPiece != null) {
        moveString += "=" + typeIdToTypeName(promotionPiece.type)
    }
    return moveString
}


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

// to be refactored completely
// make squares to indexes and not HTML elements
const anotherPieceCanJump2 = (chessboard, piece, squareFrom, squareTo) => {
    // Store current moves 
    let string = ""

    let pieces = getPieces(chessboard, piece.color, piece.type, squareFrom)
    if(pieces.length === 0) {
        return null
    }
    else {
        for(let sq of pieces) {
            let pieceMoves = getAvailableMoves(chessboard, getPieceById(sq), sq)
            if(pieceMoves.moves.includes(squareTo.id) 
            || (pieceMoves.captures.includes(squareTo.id) && piece.type != types.pawn)) {

                if(sameRow(sq, squareFrom.id)) {
                    string += getLetterFromId(squareFrom.id)
                }
                else if(sameColumn(sq, squareFrom.id)) {
                    string += (8 - parseInt(squareFrom.id.substring(0, 1)))
                }
                else {
                    string += getLetterFromId(squareFrom.id)
                }
                return string
            }
        }
    }
    return null
}

// TODO: change square from HTML to static
const getPieces2 = (chessboard, color, type, square) => {
    let pieces = []
    let rowIndex = 0
    let columnIndex = 0
    for(let row of chessboard) {
        for(let piece of row) {
            let squareID = (rowIndex + "" + columnIndex)
            if(piece.color === color && piece.type === type && square.id != squareID) {
                pieces.push(squareID)
            }
            columnIndex += 1
        }
        rowIndex += 1
        columnIndex = 0
    }
    return pieces
}



const getAvailableMoves = (chessboard, piece, row, column, cs) => {
    let color = piece.color

    if(color === colors.white){
        switch(piece.type) {
            case types.pawn:
                return whitePawnMoves(chessboard, row, column)
            
            case types.knight:
                return whiteKnightMoves(chessboard, row, column)

            case types.bishop:
                return whiteBishopMoves(chessboard, row, column)
            
            case types.rook:
                return whiteRookMoves(chessboard, row, column)
            
            case types.queen:
                return whiteQueenMoves(chessboard, row, column)
            
            case types.king:
                return whiteKingMoves(chessboard, row, column, cs)
        }
    }
    else{
        switch(piece.type) {
            case types.pawn:
                return blackPawnMoves(chessboard, row, column)
            
            case types.knight:
                return blackKnightMoves(chessboard, row, column)

            case types.bishop:
                return blackBishopMoves(chessboard, row, column)
            
            case types.rook:
                return blackRookMoves(chessboard, row, column)
            
            case types.queen:
                return blackQueenMoves(chessboard, row, column)
            
            case types.king:
                return blackKingMoves(chessboard, row, column, cs)
        }
    }
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
    
    // Move and capture up right
    try {
        let piece = chessboard[row - 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column + 1))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row - 2) + "" + (column + 1))
        }
    } catch (error) {}

    // Move and capture up left
    try {
        let piece = chessboard[row - 2][column - 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column - 1))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row - 2) + "" + (column - 1))
        }
    } catch (error) {}

    // Move and capture down right
    try {
        let piece = chessboard[row + 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 2) + "" + (column + 1))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row + 2) + "" + (column + 1))
        }
    } catch (error) {}
    // Move and capture down left
    try {
        let piece = chessboard[row + 2][column - 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 2) + "" + (column - 1))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row + 2) + "" + (column - 1))
        }
    } catch (error) {}
    
    // Move and capture right up
    try {
        let piece = chessboard[row - 1][column + 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 1) + "" + (column + 2))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row - 1) + "" + (column + 2))
        }
    } catch (error) {}
    // Move and capture right down
    try {
        let piece = chessboard[row + 1][column + 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 1) + "" + (column + 2))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row + 1) + "" + (column + 2))
        }
    } catch (error) {}

    // Move and capture left up
    try {
        let piece = chessboard[row - 1][column - 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 1) + "" + (column - 2))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row - 1) + "" + (column - 2))
        }
    } catch (error) {}

    // Move and capture left down
    try {
        let piece = chessboard[row + 1][column - 2]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row + 1) + "" + (column - 2))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row + 1) + "" + (column - 2))
        }
    } catch (error) {}

    return possibleMoves


}

const bishopMoves = (chessboard, row, column, otherColor) => {
    //let possibleMoves = new PossibleMoves()
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
        && chessboard[7][5].type === types.none && chessboard[7][6].type === types.none) {
        possibleMoves.addMove(7 + "" + 6)
    }
    // White king long castling
    if(otherColor === colors.black && !cs.whiteKingMoved && !cs.whiteARookMoved 
        && chessboard[7][1].type === types.none && chessboard[7][2].type === types.none
        && chessboard[7][3].type === types.none) {
        possibleMoves.addMove(7 + "" + 2)
    }
    
    // Black king short castling
    if(otherColor === colors.white && !cs.blackKingMoved && !cs.blackHRookMoved 
        && chessboard[0][5].type === types.none && chessboard[0][6].type === types.none) {
        possibleMoves.addMove(0 + "" + 6)
    }
    // Black king long castling
    if(otherColor === colors.white && !cs.blackKingMoved && !cs.blackARookMoved 
        && chessboard[0][1].type === types.none && chessboard[0][2].type === types.none
        && chessboard[0][3].type === types.none) {
        possibleMoves.addMove(0 + "" + 2)
    }
    
    return possibleMoves
}
