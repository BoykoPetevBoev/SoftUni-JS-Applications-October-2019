export async function fetchData(url, headers) {
    try {
        const res = await fetch(url, headers);
        console.log(`Response: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        return data;
    }
    catch{
        console.error;
    }
}
