import { fetchData } from './fetchRequest.js';
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
    const buttonsFunctionality = {
        Add: () => createCatch(),
        Load: () => loadCatch(),
        Update: (btn) => updateCatch(btn),
        Delete: (btn) => deleteCatch(btn)
    }
    const $catchForm = document.getElementById('addForm');
    const $mainDiv = document.getElementById('catches');
    const $template = $mainDiv.children[0];

    const baseURL = 'https://fisher-game.firebaseio.com/catches';

    document.getElementById('body').addEventListener('click', function (e) {
        if(typeof buttonsFunctionality[e.target.textContent] === 'function'){
            buttonsFunctionality[e.target.textContent](e.target);
        }
    });

    function loadCatch() {
        const url = `${baseURL}.json`;
        const headers = { method: 'GET' }
        fetchData(url, headers).then(extractData);
    }
    function extractData(data) {
        $mainDiv.innerHTML = '';
        Object.keys(data).forEach(code => {
            fillInfo(code, data[code]);
        });
    }
    function fillInfo(code, obj) {
        let domElement = $template.cloneNode(true);
        domElement.setAttribute('data-id', code);
        Array.from(domElement.children).map(el => {
            if (el.tagName === 'INPUT') {
                el.value = obj[el.className]
            }
        })
        appendDomElement($mainDiv, domElement);
    }
    function appendDomElement(parent, childs) {
        parent.appendChild(childs);
    }
    function createCatch() {
        const url = `${baseURL}.json`;
        createRequestInfo(url, 'POST', $catchForm);
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
        buttonsFunctionality.Load();
    }
    function createRequestInfo(url, method, parent) {
        const values = getInfo(parent);
        const body = new Catch(...values);
        const headers = {
            method: method,
            body: JSON.stringify(body)
        };
        fetchData(url, headers);
        buttonsFunctionality.Load();
    }
    function getInfo(div) {
        return Array
            .from(div.getElementsByTagName('input'))
            .reduce((arr, input) => {
                arr.push(input.value);
                return arr;
            }, []);
    }
}
attachEvents();
