// enum for winning / drawing methods
const methods = {
    'resignation':-1,
    'draw':0,
    'time':1,
    'mate':2
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
const castlingStates = [copyCastlingState(castlingState)]

// Should take an INTEGER
const changeDisplayFocus = newMoveInFocus => {

    changeDisplayHighlight(moveInFocus, newMoveInFocus)
    moveInFocus = newMoveInFocus

    if(moveInFocus === chessboardHistory.length - 1){
        allowMoves = true
    }else{
        allowMoves = false
    }
    renderPieces(chessboardHistory[moveInFocus])
} 

// This function is called when a square is clicked
const selectSquare = async id => {

    if(!allowFocusChange || !allowMoves){
        return
    }
    
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
            possibleMoves = getAvailableMoves(chessboardHistory[chessboardHistory.length - 1], currentPiece, currentSquare.row, currentSquare.col, castlingStates[castlingStates.length-1])
            highlightMoves(possibleMoves.moves)
            highlightCaptures(possibleMoves.captures)
        }
        
    }
    else {


        lastCurrentPiece = currentPiece 
        lastCurrentSquare = currentSquare

        currentSquare = new Square(parseInt(id.substring(0, 1)), parseInt(id.substring(1, 2)))
        currentPiece = chessboardHistory[moveInFocus][currentSquare.row][currentSquare.col]
        
        if(!isPossibleMove(currentSquare, possibleMoves)) {
            clearMovesAndCaptures()
            selectSquare(id)
            return
        }


        // Don't change position of this variable. Must happen before movePiece
        moveInFocus += 1
        
        let promotionPiece = null
        if(isPromotion(lastCurrentPiece, currentSquare)){
            promotionPiece = await promotion(lastCurrentPiece.color)
        }

        let isCapture = false
        if(currentPiece.type !== types.none){
            isCapture = true
        }

        let conditional = getAnotherPieceCanMoveString(lastCurrentPiece, lastCurrentSquare, currentSquare, chessboardHistory[chessboardHistory.length-1], castlingStates[castlingStates.length-1])
        let shortCastle = isShortCastle(lastCurrentPiece, lastCurrentPiece, currentSquare)
        let longCastle = isLongCastle(lastCurrentPiece, lastCurrentPiece, currentSquare)
        let moveString = getMoveString(lastCurrentPiece, lastCurrentSquare, currentSquare, isCapture, conditional, promotionPiece, shortCastle, longCastle)
        moves.push(moveString)

        let newChessBoard = copyChessboard(chessboardHistory[chessboardHistory.length-1])
        let newCastlingState = copyCastlingState(castlingStates[castlingStates.length-1])
        movePiece(newChessBoard,newCastlingState,lastCurrentSquare, currentSquare, promotionPiece)
        chessboardHistory.push(newChessBoard)
        castlingStates.push(newCastlingState)

        updatePreviousMovesDisplay(moves)
        changeDisplayFocus(moves.length)
        renderPieces(chessboardHistory[moveInFocus])

        // Means that game is over
        if(currentPiece.type === types.king){
            gameOver(lastCurrentPiece.color, methods.mate)
        }
        clearMovesAndCaptures()

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

const promotion = color => {return new Promise(async (resolve, reject) => {
    allowFocusChange = false
    var promotion = await getPromotionType(color)
    allowFocusChange = true
    removePromotionWindow()
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

// Removes moves and captures from board
const clearMovesAndCaptures = () => {
    removeAllMovesAndCaptures()
    currentPiece = null
    currentSquare = null
    lastCurrentPiece = null
    lastCurrentSquare = null
    possibleMoves = new PossibleMoves()
}

const changeToMove = moveNumber => {
    if(allowFocusChange === false || chessboardHistory.length === 1){
        return
    }
    changeDisplayFocus(moveNumber)
}

const changeToFirstMove = () => {
    changeToMove(0)
}

const changeToLastMove = () => {
    changeToMove(chessboardHistory.length - 1)
}

const changeToNextMove = () => {
    if(moveInFocus === chessboardHistory.length - 1){
        return
    }
    changeToMove(moveInFocus + 1)
}

const changeToPreviousMove = () => {
    if(moveInFocus === 0){
        return
    }
    changeToMove(moveInFocus - 1)
}

// Is called when the HTML content is done loading
window.addEventListener('DOMContentLoaded', async () => {
    initializeGlobalVariables()
    renderChessboard()
    renderPieces(chessboardHistory[moveInFocus])
    updatePreviousMovesDisplay(moves)
    initializeMovesAndBoardButtons()
    
    if(MODE === modes.twoplayer) {
        renderLeftBar()
    }
});




// Needs to take into account a flipped board and different perspectives
// Also not refactored for static file
const updateTime = () => {
    let color = (turn % 4 === 0 || turn % 4 === 1) ? colors.white : colors.black
    timer.countDown(color)

    let whiteTime = timer.getTimeWhite() 
    let blackTime = timer.getTimeBlack()

    updateTimeDisplay(whiteTime, blackTime)
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
    while(castlingStates.length > 1){
        castlingStates.pop()
    }
    
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
