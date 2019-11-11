function solve() {

    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const span = document.getElementsByClassName('info')[0];

    let nextStop = 'depot';
    let currentStop = '';

    function depart() {
        fetch(`https://judgetests.firebaseio.com/schedule/${nextStop}.json`)
            .then(chechForErrors)
            .then(res => res.json())
            .then(action)
            .catch(errorHandling)
        function chechForErrors(res) {
            if (res.ok === false) {
                throw new Error(`${res.status} - ${res.statusText}`);
            }
            return res;
        }
        function errorHandling(err) {
            span.textContent = 'Error';
            departBtn.disabled = true;
            arriveBtn.disabled = true;
            console.error(err);
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
