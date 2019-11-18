import { get, post, put, del } from './requests.js';

get().then(processData)

function processData(arr) {
    const sortedData = sortData(arr);
    sortedData.forEach(element => {
        console.log(element)
        createRow(element)
    });
}
function sortData(arr) {
    const result = arr.slice(0);
    result.sort((a, b) => a.ID - b.ID);
    return result;
}
function createRow(obj) {
    const tr = createNewElement('tr');
    const tdID = createNewElement('td', obj.ID);
    const tdFName = createNewElement('td', obj.FirstName);  
    const tdLName = createNewElement('td', obj.LastName);
    const tdFNumber = createNewElement('td',obj.FacultyNumber);
    const tdGrade = createNewElement('td',obj.Grade);
 
    tr.append(tdID, tdFName, tdLName, tdFNumber, tdGrade);
    appendNewBranch(tr);
}
function createNewElement(type, text){
    const element = document.createElement(type);
    if(text){
        element.textContent = text;
    }
    return element;
}
function appendNewBranch(element){
    const body = document.querySelector("#results > tbody");
    body.appendChild(element);
}
TODO...
