export function fetchData() {
    const baseURL = 'https://fisher-game.firebaseio.com/catches';
    const get = () => {
        const url = `${baseURL}.json`;
        const headers = { method: 'GET' }
        return fetch(url, headers).then(handleErrors).then(res => res.json());
    };
    const post = (body) => {
        const url = `${baseURL}.json`;
        const headers = {
            method: 'POST',
            body: JSON.stringify(body)
        }
        return fetch(url, headers).then(handleErrors).then(res => res.json());
    };
    const put = (body, code) => {
        const url = `${baseURL}/${code}.json`;
        const headers = {
            method: 'PUT',
            body: JSON.stringify(body)
        };
        return fetch(url, headers).then(handleErrors).then(res => res.json());
    }
    const del = (code) =>{
        const url = `${baseURL}/${code}.json`;
        const headers = { method: 'DELETE' };
        return fetch(url, headers).then(handleErrors).then(res => res.json());
    }
    function handleErrors(res){
        if(!res.ok){
            throw new Error(`${res.status} - ${res.statusText}`);
        }
        return res;
    }
    return {
        get,
        post,
        put,
        del
    }
}
