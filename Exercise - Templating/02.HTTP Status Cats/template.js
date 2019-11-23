(() => {
    renderCatTemplate();
    function renderCatTemplate() {
        const section = document.getElementById('allCats');
        const cats = window.cats;
        renderRequest()
        async function renderRequest() {
            const source = await fetch('http://127.0.0.1:5500/JS%20Applications/Exercise%20-%20Templating/02.%20HTTP%20Status%20Cats/template.hbs')
                .then(res => res.text());
            const template = Handlebars.compile(source);
            const html = template({ cats });
            section.innerHTML = html;
        }
    }
})()
function display(btn) {
    const info = btn.parentNode.getElementsByClassName('status')[0];
    const process = {
        none: () => showInfo(),
        block: () => hideInfo()
    }
    
    process[info.style.display]();

    function showInfo(){
        info.style.display = 'block';
        btn.textContent = 'Hide status code';
    }
    function hideInfo(){
        info.style.display = 'none';
        btn.textContent = 'Show status code';
    }
}
