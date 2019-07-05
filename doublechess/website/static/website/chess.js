
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
var currentPiece, lastCurrentPiece = null
var currentSquare, lastCurrentSquare = null;

var whiteKingMoved = false
var whiteHRookMoved = false
var whiteARookMoved = false
var blackKingMoved = false
var blackHRookMoved = false
var blackARookMoved = false

// current move being displayed. Should be an integer
var moveInFocus = null
//for use later
var turn = 2

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


const moves = []
removeAllChildren = htmlElement => {

    while(htmlElement.firstChild){
        htmlElement.removeChild(htmlElement.firstChild)
    }

}

changeDisplayFocus = moveID => {

    if(moveInFocus != null){
        document.getElementById("move"+moveInFocus).style.backgroundColor = null
    }
    document.getElementById(moveID).style.backgroundColor = ("#AAAACC")
    moveInFocus = moveID.replace("move", "")
} 

clearPreviousMovesDisplay = () =>{
    removeAllChildren(document.getElementById("white-moves-1"))
    removeAllChildren(document.getElementById("white-moves-2"))
    removeAllChildren(document.getElementById("black-moves-1"))
    removeAllChildren(document.getElementById("black-moves-2"))
    removeAllChildren(document.getElementById("side-bar"))
}

createMoveItem = (innerHTML, id) => {
    let element = document.createElement("div")
    element.className = "move-item"
    element.innerHTML = innerHTML
    element.id = id
    element.addEventListener("click", e => {
        changeDisplayFocus(e.target.id)
    })
    return element;
}

createSidebarItem = innerHTML => {
    let element = document.createElement("div")
    element.className = "sidebar-item"
    element.innerHTML = innerHTML
    return element;
}

// takes a list of moves as parameter, and displays them in the move display
updatePreviousMovesDisplay = moves => {

    clearPreviousMovesDisplay()
    let whiteMoves1 = document.getElementById("white-moves-1")
    let whiteMoves2 = document.getElementById("white-moves-2")
    let blackMoves1 = document.getElementById("black-moves-1")
    let blackMoves2 = document.getElementById("black-moves-2")
    let sideBar = document.getElementById("side-bar")

    if(moves.length >= 1){  
        sideBar.appendChild(createSidebarItem("1"))
        let element = document.createElement("div")
        element.className = "move-fillitem"
        whiteMoves1.appendChild(element)
    }else{
        return
    }
    let id = null
    for(let i = 0; i < moves.length; i++){
        id = ("move" + (i+1)) 
        if(i % 4 === 0){
            whiteMoves2.appendChild(createMoveItem(moves[i], id))
        }else if(i % 4 === 1){
            blackMoves1.appendChild(createMoveItem(moves[i], id))
        }else if(i % 4 === 2){
            blackMoves2.appendChild(createMoveItem(moves[i], id))
        }else{
            sideBar.appendChild(createSidebarItem(Math.floor(i / 4) + 2))
            whiteMoves1.appendChild(createMoveItem(moves[i], id))
        }
    }

    changeDisplayFocus(id)

    let container = document.getElementsByClassName("move-display-content-row")[0]
    container.scrollTop = container.scrollHeight - container.offsetHeight
}


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
        for(col_number = 0; col_number < 8; col_number++){

            let square = document.createElement('div')
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

            chess_board.appendChild(square)
            color_counter += 1
        }
        color_counter -= 1
    }

}

// This function is called when a square is clicked
const selectSquare = async id => {
    //console.log("Pressed square:" + id)
    // No current piece selected
    if(currentPiece == null) {
        //console.log("no piece selected")
        currentPiece = getPieceById(id)
        currentSquare = document.getElementById(id)

        let legalColor = null
        if(turn <= 2){
            legalColor = colors.white
        }else{
            legalColor = colors.black
        }

        // Square selected is empty square 
        if(currentPiece.type == types.none  || legalColor != currentPiece.color) {
            //console.log("piece selected is empty square")
            clearMovesAndCaptures()
            return
        }
        // Square selected holds a piece
        else {
            //console.log("piece selected is new piece")
            currentPiece = getPieceById(id)
            currentSquare = document.getElementById(id)
            
            possibleMoves = getAvailableMoves(currentPiece, id)
            highlightMoves(possibleMoves.moves)
            highlightCaptures(possibleMoves.captures)
        }
        
    }
    else {
        //console.log("Current piece selected : " + currentPiece.type)
        lastCurrentPiece = currentPiece 
        lastCurrentSquare = currentSquare

        currentPiece = getPieceById(id)
        currentSquare = document.getElementById(id)
        
        if(!legalMove()) {
            clearMovesAndCaptures() 
            return
        }
        
        // Move to empty square
        if(currentPiece.type === types.none) {
            //console.log("moving to empty square")
            await movePiece(lastCurrentSquare, currentSquare, false)
            clearMovesAndCaptures()
        }
        // Capture enemy piece
        else if(lastCurrentPiece.color != currentPiece.color) {
            //console.log("capturing enemy piece")
            await movePiece(lastCurrentSquare, currentSquare, true)
            clearMovesAndCaptures()
        }
        else {
            //console.log("clearing moves and captures")
            clearMovesAndCaptures()
            return
        }

        // Move or capture has been made
        //console.log("rendering pieces")
        renderPieces()
        turn = turn === 4 ? 1 : turn +1
    }
}

const legalMove = () => {
    for(let elem of possibleMoves.moves) {
        if(currentSquare.id === elem) {
            return true
        } 
    }
    for(let elem of possibleMoves.captures) {
        if(currentSquare.id === elem) {
            return true
        } 
    }
    //console.log("Illegal move")
    return false
}

const movePiece = (squareFrom, squareTo, capture) => {return new Promise(async (resolve, reject) =>{
    let squareFromRow = parseInt(squareFrom.id.substring(0, 1))
    let squareFromColumn = parseInt(squareFrom.id.substring(1, 2))
    
    let squareToRow = parseInt(squareTo.id.substring(0, 1))
    let squareToColumn = parseInt(squareTo.id.substring(1, 2))
    let piece = getPieceById(squareFrom.id)
    let promotionPiece = null

    chessboard[squareFromRow][squareFromColumn] = new Piece(0)
    // Case of pawn promotion
    if(piece.type === types.pawn) {
        if((piece.color === colors.white && squareToRow === 0) 
            || (piece.color === colors.black && squareToRow === 7)) {
            promotionPiece = await promotion(piece.color)
            chessboard[squareToRow][squareToColumn] = promotionPiece
            addMoveString(piece, squareFrom, squareTo, capture, promotionPiece) 
            return resolve()
        }
    }

    
    // Castling state
    if(piece.type === types.king) {
        if(piece.color === colors.white) {
            if(! whiteKingMoved && squareToColumn === 6) {
                chessboard[7][6] = piece
                chessboard[7][5] = chessboard[7][7]
                chessboard[7][7] = new Piece(0)
                whiteHRookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, true) /// why can i not skip unused variables
                whiteKingMoved = true
                return resolve()
            
            }
            else if(! whiteKingMoved && squareToColumn === 2) {
                chessboard[7][2] = piece
                chessboard[7][3] = chessboard[7][7]
                chessboard[7][0] = new Piece(0)
                whiteARookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, false, true) 
                whiteKingMoved = true
                return resolve()
            }
            whiteKingMoved = true
        }
        else {
            if(! blackKingMoved && squareToColumn === 6) {
                chessboard[0][6] = piece
                chessboard[0][5] = chessboard[0][7]
                chessboard[0][7] = new Piece(0)
                blackHRookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, true) 
                blackKingMoved = true
                return resolve()
            
            }
            else if(! blackKingMoved && squareToColumn === 2) {
                chessboard[0][2] = piece
                chessboard[0][3] = chessboard[0][7]
                chessboard[0][0] = new Piece(0)
                blackARookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, false, true) 
                blackKingMoved = true
                return resolve()
            }
            blackKingMoved = true
        }

    } 
    else if(piece.type === types.rook) {
        if(piece.color === colors.white) {
            if(squareFromColumn === 0) {
                whiteARookMoved = true
            }
            else if(squareFromColumn === 7) {
                whiteHRookMoved = true
            }
        }
        else {
            if(squareFromColumn === 0) {
                blackARookMoved = true
            }
            else if(squareFromColumn === 7) {
                blackHRookMoved = true
            }
        
        }
    }


    chessboard[squareToRow][squareToColumn] = piece
    addMoveString(piece, squareFrom, squareTo, capture) 
    return resolve()
})}

   


const getPromotionType = color => { return new Promise((resolve, reject) => {

    let container = document.getElementById("chess-board")
    let IDs = ["promotion-queen", "promotion-rook", "promotion-biship", "promotion-knight"]
    let containerFunction = e => {
        if(!IDs.includes(e.target.id)){
            e.stopPropagation()
        }
    }
    container.addEventListener("click", containerFunction, true)

    let popup = document.createElement("div")
    popup.className = "promotion"
    popup.id = "promotion"
    
    let squares = []
    for(let i = 0; i < 4; i++){
        squares.push(document.createElement("div"))
        if(i === 0 || i === 3){
            squares[i].className = "promotion-square-dark"
        }else{
            squares[i].className = "promotion-square-light"
        }
        popup.appendChild(squares[i])
    }

    let colorText = null
    if(color === colors.white){
        colorText = "white"
    }else{
        colorText = "black"
    }

    container.appendChild(popup)

    let returnValues = ["Q", "R", "B", "N"]

    for(let i = 0; i < 4; i++){
        let piece = document.createElement("div")
        piece.className = "chess-piece"
        switch(i){
            case 0: piece.className += " " + colorText +"_queen"; piece.id = IDs[i]; break;
            case 1: piece.className += " " + colorText +"_rook";  piece.id = IDs[i]; break;
            case 2: piece.className += " " + colorText +"_bishop"; piece.id = IDs[i]; break;
            case 3: piece.className += " " + colorText +"_knight";  piece.id = IDs[i]; break;
        }
        squares[i].appendChild(piece)
        squares[i].addEventListener("click", e => {
            container.removeEventListener("click", containerFunction, true)
            e.stopPropagation()
            return resolve(returnValues[i])
        }, true)
    }

})}


const promotion = color => {return new Promise(async (resolve, reject) => {
    var promotion = await getPromotionType(color)
    document.getElementById("chess-board").removeChild(document.getElementById("promotion"))
    let promotionPiece = null
    if(promotion == "Q") {
        promotionPiece = new Piece(types.queen, color)
    }
    else if(promotion == "R") {
        promotionPiece = new Piece(types.rook, color)
    }
    else if(promotion == "B") {
        promotionPiece = new Piece(types.bishop, color)
    }
    else if(promotion == "N") {
        promotionPiece = new Piece(types.knight, color)
    }
    return resolve(promotionPiece)
})}


const addMoveString = (piece, squareFrom, squareTo, capture, promotionPiece=null, shortCastles=false, longCastles=false) => {

    let moveString = ""
    
    if(shortCastles) {
        moveString += "O-O"
        moves.push(moveString)
        updatePreviousMovesDisplay(moves)
        return
    }
    else if(longCastles) {
        moveString += "O-O-O"
        moves.push(moveString)
        updatePreviousMovesDisplay(moves)
        return
    }

    if(piece.type === types.pawn && capture) {
        moveString += getLetterFromId(squareFrom.id)
    }
    else if (piece.type != types.pawn){
        moveString += typeIdToTypeName(piece.type)
    }
    
    let piecePosition = anotherPieceCanJump(piece, squareFrom, squareTo)
    if(piecePosition != -1) {
        moveString += piecePosition
    }

    if(capture) {
        moveString += "x"
    }

    moveString += getLetterFromId(squareTo.id) + (8 - parseInt(squareTo.id.substring(0, 1)))
    
    if(promotionPiece != null) {
        moveString += "=" + typeIdToTypeName(promotionPiece.type)
    }
    moves.push(moveString)
    updatePreviousMovesDisplay(moves)
}

const getLetterFromId = id => {
    let squareColumn = parseInt(id.substring(1, 2))
    let letter = null
    switch(squareColumn) {
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

const anotherPieceCanJump = (piece, squareFrom, squareTo) => {
    // Store current moves 
    let currentMoves = possibleMoves
    //possibleMoves = new PossibleMoves() 
    let string = ""

    let pieces = getPieces(piece.color, piece.type, squareTo)
    if(pieces.length === 0) {
        return -1
    }
    else {
        //console.log("SquareFrom:" + squareFrom.id + " SquareTO: " + squareTo.id)
        for(let sq of pieces) {
            //console.log("piece: " + sq)
            let moves = getAvailableMoves(getPieceById(sq), sq)
            //console.log("moves: ")
            for(let move of moves.moves) {
                //console.log(move)
            }
            for(let move of moves.captures) {
                //console.log(move)
            }
            if(moves.moves.includes(squareTo.id) 
            || moves.captures.includes(squareTo.id)) {

                //console.log("match at :"  + sq)
                if(sameRow(sq, squareFrom.id)) {
                    //console.log("same row")
                    string += getLetterFromId(squareFrom.id)
                }
                if(sameColumn(sq, squareFrom.id)) {
                    //console.log("same column")
                    string += parseInt(squareFrom.id.substring(0, 1))
                }
                return string
            }

        }
    }
    // Restore current moves
    possibleMoves = currentMoves
    return -1
}

const sameRow = (square1, square2) => {
    return (parseInt(square1.substring(0, 1)) === parseInt(square2.substring(0, 1)))
}
const sameColumn = (square1, square2) => {
    return (parseInt(square1.substring(1, 2)) === parseInt(square2.substring(1, 2)))
}


const getPieces = (color, type, square) => {
    //console.log(`getting pieces of color ${color} and type ${type}`)
    let pieces = []
    let rowIndex = 0
    let columnIndex = 0
    //console.log(square.id)
    for(let row of chessboard) {
        for(let piece of row) {
            let squareID = (rowIndex + "" + columnIndex)
            if(piece.color === color && piece.type === type && square.id != squareID) {
                //console.log("similar piece found at " + squareID)
                pieces.push(squareID)
            }
            columnIndex += 1
        }
        rowIndex += 1
        columnIndex = 0
    }
    return pieces
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
        try {
            square.removeChild(child2)    
        } catch (error) {
            
        }
    }
    currentPiece = null
    currentSquare = null
    lastCurrentPiece = null
    lastCurrentSquare = null
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
    return pawnMoves(row, column, colors.black)
}

const whiteKnightMoves = (row, column) => {
   return knightMoves(row, column, colors.black) 
}

const whiteBishopMoves = (row, column) => {
    return bishopMoves(row, column, colors.black)
}

const whiteRookMoves = (row, column) => {
    return rookMoves(row, column, colors.black)
}

const whiteQueenMoves = (row, column) => {
    return queenMoves(row, column, colors.black)
}

const whiteKingMoves = (row, column) => {
    return kingMoves(row, column, colors.black)
}



// Black pieces

const blackPawnMoves = (row, column) => {
    return pawnMoves(row, column, colors.white)
}

const blackKnightMoves = (row, column) => {
    return knightMoves(row, column, colors.white)
}

const blackBishopMoves = (row, column) => {
    return bishopMoves(row, column, colors.white)
}

const blackRookMoves = (row, column) => {
    return rookMoves(row, column, colors.white)
}

const blackQueenMoves = (row, column) => {
    return queenMoves(row, column, colors.white)
}

const blackKingMoves = (row, column) => {
    return kingMoves(row, column, colors.white)
}


// Moves

const pawnMoves = (row, column, otherColor) => {
    //let possibleMoves = new PossibleMoves()

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

const knightMoves = (row, column, otherColor) => {
    //let possibleMoves = new PossibleMoves()
    
    // Move and capture up right
    try {
        let piece = chessboard[row - 2][column + 1]
        if(piece.color === colors.none) {
            possibleMoves.addMove((row - 2) + "" + (column + 1))
        }
        else if(piece.color === otherColor) {
            possibleMoves.addCapture((row - 2) + "" + (column + 1))
        }
    } catch (error) {
    }
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

const bishopMoves = (row, column, otherColor) => {
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

const rookMoves = (row, column, otherColor) => {
    //let possibleMoves = new PossibleMoves()

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


const queenMoves = (row, column, otherColor) => {
    rookMoves(row, column, otherColor)
    return bishopMoves(row, column, otherColor)

}


const kingMoves = (row, column, otherColor) => {
    //let possibleMoves = new PossibleMoves()
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
    if(otherColor === colors.black && !whiteKingMoved && !whiteHRookMoved 
        && chessboard[7][5].type === types.none && chessboard[7][6].type === types.none) {
        possibleMoves.addMove(7 + "" + 6)
    }
    // White king long castling
    if(otherColor === colors.black && !whiteKingMoved && !whiteARookMoved 
        && chessboard[7][1].type === types.none && chessboard[7][2].type === types.none
        && chessboard[7][3].type === types.none) {
        possibleMoves.addMove(7 + "" + 2)
    }
    
    // Black king short castling
    if(otherColor === colors.white && !blackKingMoved && !blackHRookMoved 
        && chessboard[0][5].type === types.none && chessboard[0][6].type === types.none) {
        possibleMoves.addMove(0 + "" + 6)
    }
    // Black king long castling
    if(otherColor === colors.white && !blackKingMoved && !blackARookMoved 
        && chessboard[0][1].type === types.none && chessboard[0][2].type === types.none
        && chessboard[0][3].type === types.none) {
        possibleMoves.addMove(0 + "" + 2)
    }
    
    return possibleMoves
}

// Returns an object of class Piece on a given id (square)
const getPieceById  = id => {
    let row = parseInt(id.substring(0, 1))
    let column = parseInt(id.substring(1, 2))
    return chessboard[row][column]
}


const reverseChessBoard = () => {
    reverseChildrenOrder(document.getElementById("chess-board"))
}

// Reverses order of the children of htmlItem. To be used to reverse chessboard
const reverseChildrenOrder = htmlItem => {

    let firstChild = htmlItem.firstChild
    while(htmlItem.lastChild != firstChild){
        let lastItem = htmlItem.lastChild
        htmlItem.removeChild(lastItem)
        htmlItem.insertBefore(lastItem, firstChild)
    }
}

// Is called when the HTML content is done loading
window.addEventListener('DOMContentLoaded',  () => {
    renderChessboard()
    renderPieces()
});


