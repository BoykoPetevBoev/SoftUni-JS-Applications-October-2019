const appSecret = 'dc988afbdbda42b895ff13ea4e245877';
const appKey = 'kid_rk34rFAaH';
const domain = `https://baas.kinvey.com`;

function createAuthorization(type) {
    return type === 'Basic'
        ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
        : `Kinvey ${sessionStorage.getItem('authtoken')}`
}
function createHeaders(type, method, data) {
    const headers = {
        method: method,
        headers: {
            'Authorization': createAuthorization(type),
            'Content-Type': 'application/json'
        }
    }
    if (method === 'PUT' || method === 'POST') {
        headers.body = JSON.stringify(data);
    }
    return headers;
}


function get(path, endpoint, type) {
    const headers = createHeaders(type, 'GET');
    return fetchRequest(path, endpoint, headers);
}
function post(path, endpoint, type, body) {
    const headers = createHeaders(type, 'POST', body);
    return fetchRequest(path, endpoint, headers);
}
function put(path, endpoint, type, body) {
    const headers = createHeaders(type, 'PUT', body);
    return fetchRequest(path, endpoint, headers);
}
function del(path, endpoint, type) {
    const headers = createHeaders(type, 'DELETE');
    return fetchRequest(path, endpoint, headers);
}


function fetchRequest(path, endpoint, headers) {
    const url = `${domain}/${path}/${appKey}/${endpoint}`;
    return fetch(url, headers)
        .then(checkForErrors)
        .then(data => {
            if(data.status === 204){
                return data;
            }
            return  data.json();
        })
        .catch(console.error)
}
function checkForErrors(req) {
    if (!req.ok) {
        throw new Error(`${req.status} - ${req.statusText}`);
    }
    return req;
}
export { get, post, put, del }
