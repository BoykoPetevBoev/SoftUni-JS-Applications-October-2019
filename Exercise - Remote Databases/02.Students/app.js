import { get, post, put, del } from './requests.js';

let allIds = [];
const body = () => document.querySelector("#results > tbody");

document.getElementById('submit').addEventListener('click', addNewInfo)
function addNewInfo(e) {
    e.preventDefault();
    const inputs = {
        firstName: () => document.getElementById('firstName'),
        lastName: () => document.getElementById('lastName'),
        facNumber: () => document.getElementById('facNumber'),
        grade: () => document.getElementById('grade'),
        id: () => document.getElementById('id')
    }
    if (isDataValid(inputs)) {
        const body = {
            FacultyNumber: inputs.facNumber().value,
            FirstName: inputs.firstName().value,
            Grade: inputs.grade().value,
            ID: inputs.id().value,
            LastName: inputs.lastName().value
        }
        post(body).then(printElements);
        clearInputs(inputs);
    }
}
function printElements() {
    get().then(processData)
}
printElements();
function processData(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid data!');
    }
    allIds = [];
    body().innerHTML = '';

    const sortedData = sortData(arr);
    sortedData.forEach(element => {
        createRow(element)
    });
}
function sortData(arr) {
    const result = arr.slice(0);
    result.sort((a, b) => a.ID - b.ID);
    return result;
}
function createRow(obj) {
    allIds.push(obj.ID)

    const tr = createNewElement('tr');
    const tdID = createNewElement('td', obj.ID);
    const tdFName = createNewElement('td', obj.FirstName);
    const tdLName = createNewElement('td', obj.LastName);
    const tdFNumber = createNewElement('td', obj.FacultyNumber);
    const tdGrade = createNewElement('td', obj.Grade);

    tr.append(tdID, tdFName, tdLName, tdFNumber, tdGrade);
    appendNewBranch(body(), tr);
}
function createNewElement(type, text) {
    const element = document.createElement(type);
    if (text) {
        element.textContent = text;
    }
    return element;
}
function appendNewBranch(body, element) {
    body.appendChild(element);
}
function isDataValid(inputs) {
    if (typeof inputs.firstName().value !== 'string') {
        alert('First Name must be string!');
    }
    else if (typeof inputs.lastName().value !== 'string') {
        alert('Last Name must be string!');
    }
    else if (Number(inputs.facNumber().value) === NaN) {
        alert('Faculty Number must be number!');
    }
    else if (Number(inputs.firstName().value) === NaN) {
        alert('Grade must be number!');
    }
    else if (Number(inputs.id().value) === NaN || allIds.includes(inputs.id().value)) {
        alert("You can't use this ID!");
    }
    return true;
}
function clearInputs(inputs) {
    Object.keys(inputs).map(key => inputs[key]().value = '');
}
