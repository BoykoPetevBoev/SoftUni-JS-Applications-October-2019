function getDomElements() {
    return {
        $btn: () => document.getElementById('submit'),
        $input: () => document.getElementById('location'),
        $divCurrent: () => document.getElementById('current'),
        $divForecast: () => document.getElementById('forecast'),
        $divUpcoming: () => document.getElementById('upcoming')
    }
}
function appendNewElements(parent, children){
    parent.appendChild(children);
}
function clearData (element){
    element.removeChild(element.lastChild)
}
    

export { getDomElements, appendNewElements, clearData }
