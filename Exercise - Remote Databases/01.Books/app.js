import { get, post, put, del } from './requests.js';

const elements = {
    loadBtn: () => document.getElementById("loadBooks"),
    body: () => document.querySelector("body > table > tbody"),
    table: () => document.querySelector("body > table"),
    submitBtn: () => document.getElementById("addNewBook"),
    formTitle: () => document.getElementById("title"),
    formAuthor: () => document.getElementById("author"),
    formIsbn: () => document.getElementById("isbn")
}
let inProgress = false;

elements.loadBtn().addEventListener('click', loadBooks);
elements.submitBtn().addEventListener('click', addNewBook);
elements.table().addEventListener('click', function (e) {
    if (e.target.textContent === 'Delete') {
        deleteBook(e.target.value);
    }
    if (e.target.textContent === 'Edit' && !inProgress) {
        editBook(e.target.value, e.target.parentNode);
    }
})

function loadBooks() {
    const newBody = document.createElement('tbody');
    get().then(data => { extractData(data, newBody) });
}
function extractData(data, newBody) {
    data.forEach(obj => {
        const tr = createBranch(obj.title, obj.author, obj.isbn, obj._id);
        newBody.appendChild(tr);
    });
    elements.table().removeChild(elements.body());
    elements.table().appendChild(newBody);
}
function createBranch(title, author, isbn, id) {
    const [tr, tdTitle, tdAuthor, tdIsbn, td, btnEdit, btnDelete] = createElements(['tr', 'td', 'td', 'td', 'td', 'button', 'button']);

    tdTitle.textContent = title;
    tdAuthor.textContent = author;
    tdIsbn.textContent = isbn;

    btnEdit.textContent = 'Edit';
    btnEdit.value = id;
    btnDelete.textContent = 'Delete';
    btnDelete.value = id;

    appendChilds(td, [btnEdit, btnDelete]);
    appendChilds(tr, [tdTitle, tdAuthor, tdIsbn, td]);

    return tr;
}
function createElements(arr) {
    return arr.reduce((result, element) => {
        let e = document.createElement(element);
        result.push(e);
        return result;
    }, [])
}
function appendChilds(parent, elements) {
    parent.append(...elements);
}
function addNewBook(e) {
    e.preventDefault();
    const title = elements.formTitle().value;
    const author = elements.formAuthor().value;
    const isbn = elements.formIsbn().value;
    if (title === '' || author === '' || isbn === '') {
        alert('Form must be filled correctly!');
    }
    else {
        const body = { title, author, isbn };
        post(body).then(loadBooks);
        elements.formTitle().value = '';
        elements.formAuthor().value = '';
        elements.formIsbn().value = '';
    }
}
function deleteBook(id) {
    del(id).then(console.log).then(loadBooks);
}
function editBook(id, tr) {
    const inputTitle = createInputs(tr.parentNode.children[0]);
    const inputAuthor = createInputs(tr.parentNode.children[1]);
    const inputIsbn = createInputs(tr.parentNode.children[2]);
    inProgress = true;
    tr.innerHTML = ''
    const [btnSave, btnCancel] = createElements(['button', 'button']);
    btnSave.textContent = 'Save';
    btnCancel.textContent = 'Cancel';
    appendChilds(tr, [btnSave, btnCancel]);
    btnCancel.addEventListener('click', function(){
        inProgress = false;
        loadBooks();
    })
    btnSave.addEventListener('click', function () {
        if (inputTitle.value === '' || inputAuthor.value === '' || inputIsbn.value === '') {
            alert('Form must be filled correctly!');
        }
        else {
            const body = {
                title: inputTitle.value,
                author: inputAuthor.value, 
                isbn: inputIsbn.value
            }
            inProgress = false;
            put(body, id).then(loadBooks)
        }
    })
}
function createInputs(td) {
    const value = td.textContent;
    td.textContent = '';
    const input = document.createElement('input');
    input.value = value;
    td.appendChild(input);
    return input;
}

