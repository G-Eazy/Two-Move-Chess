
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
            this.duration = duration*60
        }
        this.setIncrement = increment => {
            this.increment = increment 
        }
        this.startTimer = () => {
            this.prevTime = Date.now()
            this.interval = setInterval(updateTime, 100)
            this.timerStarted = true
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
            let timeElapsed= Math.round((currentUnixTime - this.prevTime) / 100)/10
            if(color === colors.white) {
                this.timeWhite += timeElapsed
            }
            else if(color === colors.black) {
                this.timeBlack += timeElapsed
            }
            else {
                console.log("error") 
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

// Needs to take into account a flipped board and different perspectives
const updateTime = () => {
    let color = (turn % 4 === 0 || turn % 4 === 1) ? colors.white : colors.black
    timer.countDown(color)

    let whiteTime = timer.getTimeWhite() 
    let blackTime = timer.getTimeBlack()
    let timeBottom = document.getElementById("time-bottom") 
    
    timeBottom.innerHTML = Math.floor(whiteTime / 60) + ":" + (whiteTime % 60)
    
    let timeTop = document.getElementById("time-top") 
    timeTop.innerHTML = Math.floor(blackTime / 60) + ":" + (blackTime % 60)

    if(whiteTime <= 0) {
        gameOver(colors.black, methods.time) 
    } 
    if(blackTime <= 0) {
        gameOver(colors.white, methods.time) 
    } 
}

const getTimeInput = () => {
}

