export function fetchRequest() {
    const url = 'https://judgetests.firebaseio.com/';
    return {
        locationInfo: () => fetch(`${url}locations.json`).then(res => res.json()),
        currentDay: (code) => fetch(`${url}forecast/today/${code}.json`).then(res => res.json()),
        nextThreeDays: (code) => fetch(`${url}forecast/upcoming/${code}.json`).then(res => res.json())
    }
}
