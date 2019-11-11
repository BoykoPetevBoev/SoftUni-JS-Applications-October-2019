function getInfo() {
    const input = document.getElementById('stopId');
    const stopName = document.getElementById('stopName');
    const busesUl = document.getElementById('buses');

    busesUl.innerHTML = '';

    fetch(`https://judgetests.firebaseio.com/businf/${input.value}.json`)
        .then(chechForErrors)
        .then(parseRespond)
        .then(updateInfo)
        .catch(handleError)

    function chechForErrors(res) {
        if (res.ok === false) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
        return res;
    }
    function parseRespond(res) {
        return res.json();
    }
    function updateInfo({ name, buses }) {
        stopName.innerText = name;
        Object
            .entries(buses)
            .forEach(([busId, time]) => {
                let li = document.createElement('li');
                li.innerText = `Bus ${busId} arrives in ${time} min.`;
                busesUl.appendChild(li);
            });
    }
    function handleError(err) {
        console.error(err);
    }
}
