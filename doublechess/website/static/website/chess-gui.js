const removeAllChildren = htmlElement => {
    while(htmlElement.firstChild){
        htmlElement.removeChild(htmlElement.firstChild)
    }
} 

const clearPreviousMovesDisplay = () =>{
    removeAllChildren(document.getElementById("white-moves-1"))
    removeAllChildren(document.getElementById("white-moves-2"))
    removeAllChildren(document.getElementById("black-moves-1"))
    removeAllChildren(document.getElementById("black-moves-2"))
    removeAllChildren(document.getElementById("side-bar"))
}

// Renders the pieces the the chessboard datastructure to the html document
const renderPieces = chessboard => {
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

const removePromotionWindow = () => {
    document.getElementById("chess-board").removeChild(document.getElementById("promotion"))
}

const renderResetGameButton = () => {
    let resetButton = document.getElementById('reset-button')
    resetButton.addEventListener('click', () => {
        console.log("reset button pressed")
        resetGame()
    });
}


const initializeMovesAndBoardButtons = () => {

    document.addEventListener('keydown', e => {
        if(e.key === 'ArrowLeft'){
            changeToPreviousMove()
        }else if(e.key === 'ArrowRight'){
            changeToNextMove()
        }
    })

    document.getElementById("left-total").addEventListener("click", () => {
        changeToFirstMove()
    })
    document.getElementById("left-single").addEventListener("click", () => {
        changeToPreviousMove()
    })
    document.getElementById("right-single").addEventListener("click", () => {
        changeToNextMove()
    })
    document.getElementById("right-total").addEventListener("click", () => {
        changeToLastMove()
    })

    document.getElementById("reverse-board").addEventListener("click", () => {
        reverseChessBoard()
    })

}

const changeDisplayHighlight = (from, to) => {
    document.getElementById("move"+from).style.backgroundColor = null
    document.getElementById("move"+to).style.backgroundColor = ("#AAAACC")
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

    let container = document.getElementsByClassName("move-display-content-row")[0]
    container.scrollTop = container.scrollHeight - container.offsetHeight
}

const createMoveItem = (innerHTML, id) => {
    let element = document.createElement("div")
    element.className = "move-item"
    element.innerHTML = innerHTML
    element.id = id
    element.addEventListener("click", e => {
        changeToMove(parseInt(e.target.id.replace("move","")))
    })
    return element;
}

const createSidebarItem = innerHTML => {
    let element = document.createElement("div")
    element.className = "sidebar-item"
    element.innerHTML = innerHTML
    return element;
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


const renderLeftBar = () => {
    initializeResignButton()
    renderResetGameButton()
 } 

 
const initializeResignButton = () => {
    let resignButton = document.getElementById('resign-button')
    resignButton.addEventListener('click', () => {
        gameOver(colors.white, methods.resignation)
    });
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

const removeAllMovesAndCaptures = () => {

    let squares = document.getElementById("chess-board").children
    
    for(let i = 0; i < squares.length; i++){
        
        let children = squares[i].children
        for(let j = 0; j < children.length; j++){

            if(children[j].className === 'move' || children[j].className === 'capture'){
                squares[i].removeChild(children[j])
            }

        }

    }

}