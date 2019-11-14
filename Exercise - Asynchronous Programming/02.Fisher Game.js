function attachEvents() {
    class Catch {
        constructor(angler, weight, species, location, bait, captureTime) {
            this.angler = angler;
            this.weight = weight;
            this.species = species;
            this.location = location;
            this.bait = bait;
            this.captureTime = captureTime;
        }
    }
    const buttons = [
        ...document.getElementsByClassName('update'),
        ...document.getElementsByClassName('delete'),
        ...document.getElementsByClassName('load'),
        ...document.getElementsByClassName('add')
    ]
    const buttonsFunctionality = {
        Add: () => createCatch(),
        Load: () => loadCatch(),
        Update: (btn) => updateCatch(btn),
        Delete: (btn) => deleteCatch(btn)
    }
    const catchForm = document.getElementById('addForm');
    const mainDiv = document.getElementById('catches');

    const baseURL = 'https://fisher-game.firebaseio.com/catches';

    buttons.map(btn => btn.addEventListener('click', function () {
        buttonsFunctionality[this.textContent](this);
    }));

    function loadCatch() {
        const url = `${baseURL}.json`;
        const headers = { method: 'GET' }
        fetchData(url, headers).then(extractData);
    }
    function extractData(data) {
        Object.keys(data).forEach(code => {
            createDomPart(code, data[code]);
        });
    }
    function createDomPart(code, obj) {
        const x = undefined;
        const divConteiner = createElement('div', x, 'catch');
        divConteiner.setAttribute('data-id', code);

        const arr = [];
        arr.push(createElement('lable', x, x, x, 'Angler'));
        arr.push(createElement('input', obj.angler, 'angler', 'text'));
        arr.push(createElement('hr'));
        arr.push(createElement('lable', x, x, x, 'Weight'));
        arr.push(createElement('input', obj.weight, 'weight', 'number'));
        arr.push(createElement('hr'));
        arr.push(createElement('lable', x, x, x, 'Species'));
        arr.push(createElement('input', obj.species, 'species', 'text'));
        arr.push(createElement('hr'));
        arr.push(createElement('lable', x, x, x, 'Location'));
        arr.push(createElement('input', obj.location, 'location', 'text'));
        arr.push(createElement('hr'));
        arr.push(createElement('lable', x, x, x, 'Bait'));
        arr.push(createElement('input', obj.bait, 'bait', 'text'));
        arr.push(createElement('hr'));
        arr.push(createElement('lable', x, x, x, 'Capture Time'));
        arr.push(createElement('input', obj.captureTime, 'captureTime', 'number'));
        arr.push(createElement('hr'));
        arr.push(createElement('button', x, 'update', x, 'Update'));
        arr.push(createElement('button', x, 'delete', x, 'Delete'));

        appendChilds(divConteiner, arr);
    }
    function appendChilds(parent, childs) {
        
        parent.append(...childs);
        mainDiv.appendChild(parent);
    }
    function createElement(domElement, value, className, type, textContent) {
        const element = document.createElement(domElement);
        if (className !== undefined) {
            element.classList.add(className);
        }
        if (value !== undefined) {
            element.value = value;
        }
        if (type !== undefined) {
            element.type = type;
        }
        if (textContent !== undefined) {
            element.textContent = textContent;
        }
        return element;
    }
    function createCatch() {
        const url = `${baseURL}.json`;
        createRequestInfo(url, 'POST', catchForm);
    }
    function updateCatch(btn) {
        const code = btn.parentNode.getAttribute("data-id");
        const url = `${baseURL}/${code}.json`;
        createRequestInfo(url, 'PUT', btn.parentNode);
    }
    function deleteCatch(btn) {
        const headers = { method: 'DELETE' };
        const code = btn.parentNode.getAttribute("data-id");
        const url = `${baseURL}/${code}.json`;
        fetchData(url, headers);
    }
    function createRequestInfo(url, method, parent) {
        const values = getInfo(parent);
        const body = new Catch(...values);
        const headers = {
            method: method,
            body: JSON.stringify(body)
        };
        fetchData(url, headers);
    }
    function getInfo(div) {
        return Array.from(div.getElementsByTagName('input'))
            .reduce((arr, input) => {
                arr.push(input.value);
                return arr;
            }, []);
    }
    async function fetchData(url, headers) {
        try {
            const res = await fetch(url, headers);
            console.log(res)
            const data = await res.json();
            return data;
        }
        catch{
            console.error;
        }
    }
}

attachEvents();
