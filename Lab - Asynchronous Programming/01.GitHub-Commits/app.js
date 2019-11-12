function loadCommits() {
    const username = document.getElementById('username').value;
    const repository = document.getElementById('repo').value;
    const ul = document.getElementById('commits');

    let url = `https://api.github.com/repos/${username}/${repository}/commits`;

    logFetch(url)

    async function logFetch(url) {
        try {
            const response = await fetch(url);
            checkForError(response);
            let data = await response.json();
            extractData(data);
        }
        catch (err) {
            console.error(err);
            let msg = `<li>${err}</li>`;
            printData(ul, msg);
        }
    }
    function extractData(data) {
        let elements = data.reduce((result, obj) => {
             return result += `<li>${obj.commit.author.name}: ${obj.commit.message}</li> `;
            }, '')
        printData(ul, elements);
    }
    function printData(parent, info) {
        parent.innerHTML = info;
    }
    function checkForError(res) {
        if (res.ok === false) {
            throw new Error(`${res.status} (${res.statusText})`);
        }
        return res;
    }
}
