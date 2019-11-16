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

    document.getElementById('body').addEventListener('click', function (e) {
        if (typeof buttonsFunctionality[e.target.textContent] === 'function') {
            buttonsFunctionality[e.target.textContent](e.target);
        }
    });
    function createCatch() {
        const values = getInfo($catchForm);
        const body = new Catch(...values);
        fetchData().post(body).catch(console.error);
        loadCatch();
    }
    function updateCatch(btn) {
        const code = btn.parentNode.getAttribute("data-id");
        const values = getInfo(btn.parentNode);
        const body = new Catch(...values);
        fetchData().put(body, code).catch(console.error);
        loadCatch();
    }
    function deleteCatch(btn) {
        const code = btn.parentNode.getAttribute("data-id");
        fetchData().del(code).catch(console.error);
        loadCatch();
    }
    function loadCatch() {
        fetchData().get().then(handleErrors).then(extractData).catch(console.error);
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
                el.value = obj[el.className];
            }
        })
        appendDomElement($mainDiv, domElement);
    }
    function appendDomElement(parent, childs) {
        parent.appendChild(childs);
    }
    function getInfo(div) {
        return Array
            .from(div.getElementsByTagName('input'))
            .reduce((arr, input) => {
                arr.push(input.value);
                return arr;
            }, []);
    }
    function handleErrors(res){
        if(typeof res !== 'object'){
            throw new Error(`Invalid responce data!`);
        }
        return res;
    }
}
attachEvents();

