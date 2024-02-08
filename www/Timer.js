class Timer{
    constructor(){
    }

    static getToday(){
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth()+1;
        const year = now.getFullYear();
    
        return `${day}.${month}.${year}`;
    }

    startWork(){
        const data = {
            start: new Date(),
            date: Timer.getToday()
        }

        localStorage.setItem("timer", JSON.stringify(data))
    }

    endWork(){
        const {start, date} = JSON.parse(localStorage.getItem('timer'));
        const endWork = new Date();
        const startWork = new Date(start)
        localStorage.setItem("timer", "")

        const minutes = ((endWork - startWork) / 60000)//.toFixed(0)

        //if(minutes < 1) return;

        return {
            startWork,
            endWork,
            minutes,
            date
        }
    }

    isRunning(){
        if(localStorage.getItem("timer") === "") return false
        return true
    }
}