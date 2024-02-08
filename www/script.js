const DAY_NAMES = ["sonntag", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag"];
const hourRate = 8;

(async function main(){
    const timer = new Timer();
    const list = new VList('#list', {
        template: (data) => {

            console.log(data)
            const day = DAY_NAMES[new Date(data.startWork).getDay()]
            const date = data.date
            const earned = `${((data.minutes / 60) * hourRate).toFixed(2)}€`
            const started = `${data.startWork.getHours()}:${data.startWork.getMinutes()}`
            const ended = `${data.endWork.getHours()}:${data.endWork.getMinutes()}`
            const worked = `${(data.minutes / 60).toFixed(2)}h`
            
            return $("div", {className: "entry"}, [
                $("div", {className: "space-between"}, [
                    $("span", {}, [day]),
                    $("span", {}, [date]),
                    $("span", {}, [earned])
                ]),
                $("div", {className: "space-between"}, [
                    $("span", {}, [
                        $("span", {}, [started]),
                        $("span", {}, [ended])
                    ]),
                    $("span", {}, [worked])
                ])
            ])
        }
        
    });
    const storage = new Storage("worktimerdb", 1);
    await storage.connect()
    
    const workBtn = document.getElementById('work');
    //const pauseBtn = document.getElementById('pause');
    //const addTimeBtn = document.getElementById('add-time');
    
    workBtn.addEventListener('click', e => {
        const self = e.target;
        const isRunning = timer.isRunning()
        
        if(isRunning){
            const result = timer.endWork();
            if(!result) return; // If it's less than 1min don't add it #bloat

            storage.tx("entries").store("entries").insert(result)

            list.add(result)
        }else{
            timer.startWork();
        }

        self.textContent = isRunning ? "Start Work" : "Stop Work";
    })

    let entries = await storage.tx("entries").store("entries").get()
    list.addAll(entries)
})()