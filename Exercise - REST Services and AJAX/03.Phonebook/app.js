function attachEvents() {
    const btnLoad = document.getElementById('btnLoad');
    const btnCreate = document.getElementById('btnCreate');
    const ul = document.getElementById('phonebook');
    const inputPerson = document.getElementById('person');
    const inputPhone = document.getElementById('phone');

    btnLoad.addEventListener('click', loadData);
    btnCreate.addEventListener('click', addNewInfo);

    function deleteData() {
        let headers = {
            method: 'DELETE'
        }
        fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${this.value}.json`, headers)
            .then(loadData)
            .catch(handleError)
    }
    function loadData() {
        fetch('https://phonebook-nakov.firebaseio.com/phonebook.json')
            .then(chechForErrors)
            .then(res => res.json())
            .then(chechForErrors)
            .then(printInfo)
            .catch(handleError)
        function printInfo(data) {
            ul.innerHTML = '';
            Object.entries(data)
                .forEach(([id, info]) => {
                    let li = document.createElement('li');
                    li.textContent = `${info.person}: ${info.phone}`;

                    let btn = document.createElement('button');
                    btn.textContent = 'Delete';
                    btn.value = id;
                    btn.addEventListener('click', deleteData)

                    li.appendChild(btn);
                    ul.appendChild(li);
                })
        }
    }
    function addNewInfo() {
        let headers = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                person: inputPerson.value,
                phone: inputPhone.value
            })
        }
        fetch('https://phonebook-nakov.firebaseio.com/phonebook.json', headers)
            .then(() => {
                inputPerson.value = '';
                inputPhone.value = '';
                loadData();
            })
            .catch(handleError)
    }
    function chechForErrors(res) {
        if (res === null || res === undefined) {
            throw new Error('Invalid JSON data!');
        }
        else if (res.ok === false) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }
        return res;
    }
    function handleError(err) {
        console.error(err);
    }
}
attachEvents();
