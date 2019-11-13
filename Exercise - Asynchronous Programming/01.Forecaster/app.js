import { getDomElements, appendNewElements, clearData} from './dom.js';
import { fetchRequest } from './fetch.js';

function attachEvents() {

    const symbols = {
        Sunny: '☀',
        'Partly sunny': '⛅',
        Overcast: '☁',
        Rain: '☂',
        Degrees: '°'
    }
    getDomElements().$btn().addEventListener('click', main);

    function main() {
        const city = getDomElements().$input().value;
        fetchRequest().locationInfo()
            .then(data => findCity(data, city))
            .then(({ code }) => requestCityInfo(code))
            .then(([currentDay, nextDays]) => processInfo(currentDay, nextDays))
            .catch(handleError)
    }
    function findCity(data, city) {
        return data.find((obj) => obj.name === city);
    }
    function requestCityInfo(code) {
        return Promise.all([
            fetchRequest().currentDay(code),
            fetchRequest().nextThreeDays(code)
        ]);
    }
    function processInfo(currentDay, nextDays) {
        getDomElements().$divForecast().style.display = 'block';

        const forecast = currentDayInfo(currentDay);
        clearData(getDomElements().$divCurrent());
        appendNewElements(getDomElements().$divCurrent(), forecast);

        const forecastInfo = upcomingDaysInfo(nextDays);
        clearData(getDomElements().$divUpcoming());
        appendNewElements(getDomElements().$divUpcoming(), forecastInfo);
    }
    function currentDayInfo(day) {
        const deg = degreesTemplate(day.forecast)
        const sym = symbols[day.forecast.condition]

        const divWrapper = createElement('div', ['forecasts']);
        const spanSym = createElement('span', ['condition', 'symbol'], sym);
        const span = createElement('span', ['condition']);
        const spanName = createElement('span', ['forecast-data'], day.name);
        const spanTemp = createElement('span', ['forecast-data'], deg);
        const spanWeather = createElement('span', ['forecast-data'], day.forecast.condition);

        span.append(spanName, spanTemp, spanWeather);
        divWrapper.append(spanSym, span);

        return divWrapper;
    }
    function upcomingDaysInfo(nextDays) {
        const divWrapper = createElement('div', ['forecast-info']);

        nextDays.forecast.forEach(day => {
            const deg = degreesTemplate(day);
            const sym = symbols[day.condition];

            const span = createElement('span', ['upcoming']);
            const spanSym = createElement('span', ['symbol'], sym);
            const spanDeg = createElement('span', ['forecast-data'], deg);
            const spanWeather = createElement('span', ['forecast-data'], day.condition);

            span.append(spanSym, spanDeg, spanWeather);
            divWrapper.appendChild(span);
        });
        return divWrapper;
    }
    function degreesTemplate(obj) {
        return `${obj.low}${symbols.Degrees}/${obj.high}${symbols.Degrees}`;
    }
    function createElement(type, classNames, text) {
        const element = document.createElement(type);
        if (classNames) {
            element.classList.add(...classNames);
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }
    function handleError(err){
        console.error('Invalid input');
        getDomElements().$divForecast().style.display = 'block';
        const error = createElement('div', ['forecasts'], 'Error!');
        const errorMsg = createElement('div', ['forecasts'], 'Invalid input!');

        clearData(getDomElements().$divCurrent());
        clearData(getDomElements().$divUpcoming());
        appendNewElements(getDomElements().$divCurrent(), error);
        appendNewElements(getDomElements().$divUpcoming(), errorMsg);
    }
}
attachEvents();
