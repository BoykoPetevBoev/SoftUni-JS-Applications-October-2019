function solve() {

    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const span = document.getElementsByClassName('info')[0];

    let nextStop = 'depot';
    let currentStop = '';

    function depart() {
        fetch(`https://judgetests.firebaseio.com/schedulej/${nextStop}.json`)
            .then(res => {
                if(res.ok === false){
                    errorHandling();
                }
                return res;
            })
            .then(res => res.json())
            .then(action)
            .catch(errorHandling)

        function errorHandling(){
            span.textContent = 'Error';
            departBtn.disabled = true;
            arriveBtn.disabled = true;
            throw new Error('Invalid data received!');
        }
        function action({ name, next }) {
            nextStop = next;
            currentStop = name;
            span.textContent = `Next stop ${name}`;
            departBtn.disabled = true;
            arriveBtn.disabled = false;
        }
    }
    function arrive() {
        span.textContent = `Arriving at ${currentStop}`;
        currentStop = nextStop;
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();
