function attachEvents() {
    const sendBtn = document.getElementById('submit');
    const refreshBtn = document.getElementById('refresh');
    const inputName = document.getElementById('author');
    const inputMessage = document.getElementById('content');
    const textarea = document.getElementById('messages');

    sendBtn.addEventListener('click', sendMessage);
    refreshBtn.addEventListener('click', showMessages);

    function sendMessage() {
        const headers = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                author: inputName.value,
                content: inputMessage.value
            })
        }
        fetch('https://rest-messanger.firebaseio.com/messanger.json', headers)
            .then()
            .catch(handleErrors);
    }
    function showMessages() {
        fetch('https://rest-messanger.firebaseio.com/mmessanger.json')
            .then(chechForErrors)
            .then(res => res.json())
            .then(chechForErrors)
            .then(data => {
                textarea.value = '';
                Object.values(data)
                    .forEach(({ author, content }) => {
                        textarea.value += `${author}: ${content}\n`;
                    });
            })
            .catch(handleErrors);
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
    function handleErrors(err) {
        console.error(err);
    }
}

attachEvents();
