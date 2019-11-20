function solve() {
    document.getElementById('btnLoadTowns').addEventListener('click', main)

    async function main() {
        const towns = document.getElementById('towns').value.split(', ');
        const source = await fetch('http://127.0.0.1:5500/JS%20Applications/Exercise%20-%20Templating/01.%20List%20Towns/template.hbs')
            .then(res => res.text())

        const template = Handlebars.compile(source);

        const html = template({ towns });
        const div = document.getElementById('root')

        div.innerHTML = html;
    }
}
solve()
