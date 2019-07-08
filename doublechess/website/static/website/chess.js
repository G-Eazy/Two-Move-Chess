// enum for winning / drawing methods
const methods = {
    'resignation':-1,
    'draw':0,
    'time':1,
    'mate':2
}

const castlingState = {
    "whiteKingMoved" : false,
    "whiteHRookMoved" : false,
    "whiteARookMoved" : false,
    "blackKingMoved" : false,
    "blackHRookMoved" : false,
    "blackARookMoved" : false
}

const modes = {
    'homepage' : 0,
    'tutorial' : 1, 
    'debug' : 2,
    'twoplayer' : 3,
    'analysis' : 4
}


// Global variables 
var MODE = null

var timer = null
var possibleMoves = new PossibleMoves()
var currentPiece, lastCurrentPiece = null
var currentSquare, lastCurrentSquare = null;

// controls who gets to move pieces
var allowFocusChange = true
var allowMoves = true

// current move being displayed. Should be an integer
var moveInFocus = 0
var turn = 1


const chessboardHistory = getNewChessboardHistory()
const moves = []

const removeAllChildren = htmlElement => {
    while(htmlElement.firstChild){
        htmlElement.removeChild(htmlElement.firstChild)
    }
}

const changeDisplayFocus = moveID => {
    if(moveInFocus != null){
        document.getElementById("move"+moveInFocus).style.backgroundColor = null
    }
    document.getElementById(moveID).style.backgroundColor = ("#AAAACC")
    moveInFocus = parseInt(moveID.replace("move", ""))

    if(moveInFocus === chessboardHistory.length - 1){
        allowMoves = true
    }else{
        allowMoves = false
    }
    renderPieces(moveInFocus)
} 

const clearPreviousMovesDisplay = () =>{
    removeAllChildren(document.getElementById("white-moves-1"))
    removeAllChildren(document.getElementById("white-moves-2"))
    removeAllChildren(document.getElementById("black-moves-1"))
    removeAllChildren(document.getElementById("black-moves-2"))
    removeAllChildren(document.getElementById("side-bar"))
}

const createMoveItem = (innerHTML, id) => {
    let element = document.createElement("div")
    element.className = "move-item"
    element.innerHTML = innerHTML
    element.id = id
    element.addEventListener("click", e => {
        if(!allowFocusChange){
            return
        }
        changeDisplayFocus(e.target.id)
    })
    return element;
}

const createSidebarItem = innerHTML => {
    let element = document.createElement("div")
    element.className = "sidebar-item"
    element.innerHTML = innerHTML
    return element;
}

const initializeResignButton = () => {
    let resignButton = document.getElementById('resign-button')
    resignButton.addEventListener('click', () => {
        gameOver(colors.white, methods.resignation)
    });
}
// takes a list of moves as parameter, and displays them in the move display
const updatePreviousMovesDisplay = moves => {

    clearPreviousMovesDisplay()
    let whiteMoves1 = document.getElementById("white-moves-1")
    let whiteMoves2 = document.getElementById("white-moves-2")
    let blackMoves1 = document.getElementById("black-moves-1")
    let blackMoves2 = document.getElementById("black-moves-2")
    let sideBar = document.getElementById("side-bar")

    if(moves.length >= 1){  
        sideBar.appendChild(createSidebarItem("1"))
        let element = createMoveItem("", "move0")
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
const renderPieces = index => {
    for(row_number = 0; row_number < 8; row_number++){
        for(col_number = 0; col_number < 8; col_number++){

            let id = row_number + '' + col_number
            let square = document.getElementById(id)
            while(square.firstChild){
                square.removeChild(square.firstChild)
            }
            let piece = makePiece((chessboardHistory[index])[row_number][col_number])
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
                if(!allowFocusChange || !allowMoves){
                    return
                }
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
    let legalColor = null

    if(turn % 4 === 0 || turn % 4 === 1){
        legalColor = colors.white
    }else{
        legalColor = colors.black
    }

    // No current piece selected
    if(currentPiece == null) {
        currentSquare = new Square(parseInt(id.substring(0, 1)), parseInt(id.substring(1, 2)))
        currentPiece = chessboardHistory[moveInFocus][currentSquare.row][currentSquare.col]


        // Square selected is empty square 
        if(currentPiece.type == types.none  || legalColor != currentPiece.color) {
            clearMovesAndCaptures()
            return
        }
        // Square selected holds a piece
        else {
            possibleMoves = getAvailableMoves(chessboardHistory[chessboardHistory.length - 1], currentPiece, currentSquare.row, currentSquare.col, castlingState)
            highlightMoves(possibleMoves.moves)
            highlightCaptures(possibleMoves.captures)
        }
        
    }
    else {
        lastCurrentPiece = currentPiece 
        lastCurrentSquare = currentSquare

        currentSquare = new Square(parseInt(id.substring(0, 1)), parseInt(id.substring(1, 2)))
        currentPiece = chessboardHistory[moveInFocus][currentSquare.row][currentSquare.col]
        
        if(!legalMove()) {
            clearMovesAndCaptures() 
            return
        }

        chessboardHistory.push(copyChessboard(chessboardHistory[chessboardHistory.length -1]))

        // Don't change position of this variable. Must happen before movePiece
        moveInFocus += 1
        
        // Move to empty square
        if(currentPiece.type === types.none) {
            await movePiece(lastCurrentSquare, currentSquare, false)
            clearMovesAndCaptures()
        }
        // Capture enemy piece
        else if(lastCurrentPiece.color != currentPiece.color) {
            await movePiece(lastCurrentSquare, currentSquare, true)
            clearMovesAndCaptures()
        }
        else {
            console.log("shouldnt happen")
            clearMovesAndCaptures()
            return
        }

        // Move or capture has been made
        renderPieces(moveInFocus)
        turn += 1

        if(MODE === modes.twoplayer) {
            if(turn === 3) {
                timer.startTimer()
            }
            
            // turn has switched if true
            if(legalColor === colors.white && (turn % 4 === 2 || turn % 4 === 3)) {
                timer.changeTurn(colors.black)
            }
            else if(legalColor === colors.black && (turn % 4 === 0 || turn % 4 === 1)) {
                timer.changeTurn(colors.white)
            }
        }

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
    return false
}

const movePiece = (squareFrom, squareTo, capture) => {return new Promise(async (resolve, reject) =>{

    let squareFromRow = parseInt(squareFrom.id.substring(0, 1))
    let squareFromColumn = parseInt(squareFrom.id.substring(1, 2))
    
    let squareToRow = parseInt(squareTo.id.substring(0, 1))
    let squareToColumn = parseInt(squareTo.id.substring(1, 2))
    let piece = getPieceById(squareFrom.id)
    let promotionPiece = null
    
    let conditional = anotherPieceCanJump(piece, squareFrom, squareTo)

    chessboardHistory[moveInFocus][squareFromRow][squareFromColumn] = new Piece(0)
        
    // game over
    if(chessboardHistory[moveInFocus][squareToRow][squareToColumn].type === types.king) {
        let winner = chessboardHistory[moveInFocus][squareToRow][squareToColumn].color === colors.white ? colors.black : colors.white
        chessboardHistory[moveInFocus][squareToRow][squareToColumn] = piece
        renderPieces(moveInFocus)
        gameOver(winner, methods.mate)
        return
    }


    // Case of pawn promotion
    if(piece.type === types.pawn) {
        if((piece.color === colors.white && squareToRow === 0) 
            || (piece.color === colors.black && squareToRow === 7)) {
            promotionPiece = await promotion(piece.color)
            chessboardHistory[moveInFocus][squareToRow][squareToColumn] = promotionPiece
            addMoveString(piece, squareFrom, squareTo, capture, null, promotionPiece) 
            return resolve()
        }
    }

    
    // Castling state
    if(piece.type === types.king) {
        if(piece.color === colors.white) {
            if(! castlingState.whiteKingMoved && squareToColumn === 6) {
                chessboardHistory[moveInFocus][7][6] = piece
                chessboardHistory[moveInFocus][7][5] = chessboardHistory[moveInFocus][7][7]
                chessboardHistory[moveInFocus][7][7] = new Piece(0)
                castlingState.whiteHRookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, null, true) /// why can i not skip unused variables
                castlingState.whiteKingMoved = true
                return resolve()
            
            }
            else if(! castlingState.whiteKingMoved && squareToColumn === 2) {
                chessboardHistory[moveInFocus][7][2] = piece
                chessboardHistory[moveInFocus][7][3] = chessboardHistory[moveInFocus][7][7]
                chessboardHistory[moveInFocus][7][0] = new Piece(0)
                castlingState.whiteARookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, null, false, true) 
                castlingState.whiteKingMoved = true
                return resolve()
            }
            castlingState.whiteKingMoved = true
        }
        else {
            if(! castlingState.blackKingMoved && squareToColumn === 6) {
                chessboardHistory[moveInFocus][0][6] = piece
                chessboardHistory[moveInFocus][0][5] = chessboardHistory[moveInFocus][0][7]
                chessboardHistory[moveInFocus][0][7] = new Piece(0)
                castlingState.blackHRookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, null, true) 
                castlingState.blackKingMoved = true
                return resolve()
            
            }
            else if(! castlingState.blackKingMoved && squareToColumn === 2) {
                chessboardHistory[moveInFocus][0][2] = piece
                chessboardHistory[moveInFocus][0][3] = chessboardHistory[moveInFocus][0][7]
                chessboardHistory[moveInFocus][0][0] = new Piece(0)
                castlingState.blackARookMoved = true
                addMoveString(piece, squareFrom, squareTo, capture, null, null, false, true) 
                castlingState.blackKingMoved = true
                return resolve()
            }
            castlingState.blackKingMoved = true
        }

    } 
    else if(piece.type === types.rook) {
        if(piece.color === colors.white) {
            if(squareFromColumn === 0) {
                castlingState.whiteARookMoved = true
            }
            else if(squareFromColumn === 7) {
                castlingState.whiteHRookMoved = true
            }
        }
        else {
            if(squareFromColumn === 0) {
                castlingState.blackARookMoved = true
            }
            else if(squareFromColumn === 7) {
                castlingState.blackHRookMoved = true
            }
        
        }
    }
    
    chessboardHistory[moveInFocus][squareToRow][squareToColumn] = piece
    addMoveString(piece, squareFrom, squareTo, capture, conditional) 
    return resolve()
})}


const gameOver = (color, method) => {
    let winner = color === colors.white ? "white" : "black"

    if(method === methods.draw) {
        // handle draw
        alert("draw")
    } 
    else if(method === methods.resignation) {
        // handle resignation
        alert(winner + " wins by resignation")
    }
    else if(method === methods.time) {
        // handle time 
        alert(winner + " wins on time")
    }
    else if(method === methods.mate) {
        // handle mate 
        alert(winner + " wins by checkmate")
    }
    else {
        // handle error in network / session or other 
        alert("kernel panic!")
    }


    // freeze all moves
    allowMoves = false

    // Stop timer
    if(MODE === modes.twoplayer) {
        timer.stop()
    }
    // render buttons for analysis / new game etc

}

const getPromotionType = color => { return new Promise((resolve, reject) => {
    let container = document.getElementById("chess-board")
    let IDs = ["promotion-queen", "promotion-rook", "promotion-biship", "promotion-knight"]
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
        piece.setAttribute("data-eventstatus", "letthrough")
        squares[i].appendChild(piece)
        piece.addEventListener("click", e => {
            return resolve(returnValues[i])
        }, true)
    }

})}


const promotion = color => {return new Promise(async (resolve, reject) => {
    allowFocusChange = false
    var promotion = await getPromotionType(color)
    allowFocusChange = true
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


const addMoveString = (piece, squareFrom, squareTo, capture, conditional=null, promotionPiece=null, shortCastles=false, longCastles=false) => {
    
    let moveString = getMoveString(piece, squareFrom, squareTo, capture, conditional, promotionPiece, shortCastles, longCastles)
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


const anotherPieceCanJump = (piece, squareFrom, squareTo) => {
    // Store current moves 
    let currentMoves = possibleMoves
    possibleMoves = new PossibleMoves() 
    let string = ""

    let pieces = getPieces(piece.color, piece.type, squareFrom)
    if(pieces.length === 0) {
        return null
    }
    else {
        for(let sq of pieces) {
            let row = parseInt(sq.substring(0, 1))
            let column = parseInt(sq.substring(1, 2))
            let pieceMoves = getAvailableMoves(chessboardHistory[chessboardHistory.length - 1], piece, row, column, castlingState)
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
        possibleMoves = new PossibleMoves()
        }
    }
    // Restore current moves
    possibleMoves = currentMoves
    return null
}

const sameRow = (square1, square2) => {
    return (parseInt(square1.substring(0, 1)) === parseInt(square2.substring(0, 1)))
}
const sameColumn = (square1, square2) => {
    return (parseInt(square1.substring(1, 2)) === parseInt(square2.substring(1, 2)))
}


const getPieces = (color, type, square) => {
    let pieces = []
    let rowIndex = 0
    let columnIndex = 0
    for(let row of chessboardHistory[moveInFocus]) {
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


// Returns an object of class Piece on a given id (square)
const getPieceById = id => {
    let row = parseInt(id.substring(0, 1))
    let column = parseInt(id.substring(1, 2))
    return chessboardHistory[moveInFocus][row][column]
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

const changeToMove = moveNumber => {
    
    if(moveNumber < 0){
        return
    }else if(moveNumber >= chessboardHistory.length){
        return
    }else if(chessboardHistory.length === 1){
        return
    }else{
        changeDisplayFocus("move"+moveNumber)
    }

}

const initializeMovesAndBoardButtons = () => {

    document.addEventListener('keydown', e => {
        if(allowFocusChange === false){
            return
        }
        if(e.key === 'ArrowLeft'){
            changeToMove(moveInFocus -1)
        }else if(e.key === 'ArrowRight'){
            changeToMove(moveInFocus + 1)
        }
    })

    document.getElementById("left-total").addEventListener("click", () => {
        if(allowFocusChange === false){
            return
        }
        changeToMove(0)
    })
    document.getElementById("left-single").addEventListener("click", () => {
        if(allowFocusChange === false){
            return
        }
        changeToMove(moveInFocus - 1)
    })
    document.getElementById("right-single").addEventListener("click", () => {
        if(allowFocusChange === false){
            return
        }
        changeToMove(moveInFocus + 1)
    })
    document.getElementById("right-total").addEventListener("click", () => {
        if(allowFocusChange === false){
            return
        }
        changeToMove(chessboardHistory.length - 1)
    })

    document.getElementById("reverse-board").addEventListener("click", () => {
        reverseChessBoard()
    })

}

// Is called when the HTML content is done loading
window.addEventListener('DOMContentLoaded', async () => {
    initializeGlobalVariables()
    renderChessboard()
    renderPieces(moveInFocus)
    updatePreviousMovesDisplay(moves)
    initializeMovesAndBoardButtons()
    renderLeftBar()
    // test functions
        



});

const renderLeftBar = () => {
    initializeResignButton()
    renderResetGameButton()
    

    
         
} 

const initializeGlobalVariables = () => {
    MODE = getMode()

    if(MODE === modes.twoplayer) {
        timer = new Timer()
        // preliminary values - to be retrieved from user
        timer.setDuration(5)
        timer.setIncrement(3)
    }

}
const renderResetGameButton = () => {
    let resetButton = document.getElementById('reset-button')
    resetButton.addEventListener('click', () => {
        console.log("reset button pressed")
        resetGame()
    });
}

const resetGame = () => {
    // this is the easy fix
    window.location.replace("/twoplayer/")
    /* 
    resetGlobalValues()
    clearMovesAndCaptures()
    clearPreviousMovesDisplay()
    renderChessboard()
    console.log("reset game MIF:" + moveInFocus)
    renderPieces(moveInFocus)
    initializeMovesAndBoardButtons()
    renderLeftBar()
    */
}

const resetGlobalValues = () => {

    // this is the not easy fix
    //moves = []
    castlingState.whiteKingMoved = false
    castlingState.whiteHRookMoved = false
    castlingState.whiteARookMoved = false
    castlingState.blackKingMoved = false
    castlingState.blackHRookMoved = false
    castlingState.blackARookMoved = false
    
    allowMoves = true
    allowFocusChange = true
    moveInFocus = 0
    turn = 1

    while(chessboardHistory.length > 1) {
        chessboardHistory.pop()
    }

}

const getMode = () => { 
    let url = "" + document.location
    let mode = null
    switch(url) {
        case "http://localhost:8000/":
            mode = modes.homepage
            break
        case "http://localhost:8000/tutorial/":
            mode = modes.tutorial
            break
        case "http://localhost:8000/debug/":
            mode = modes.homepage
            break
        case "http://localhost:8000/twoplayer/":
            mode = modes.twoplayer
            break
        case "http://localhost:8000/analysis/":
            mode = modes.analysis
            break
        default:
            mode = modes.homepage 
    }

    return mode
}
