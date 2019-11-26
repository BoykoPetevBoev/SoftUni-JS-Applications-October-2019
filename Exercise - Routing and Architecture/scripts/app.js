import { get, post, put, del } from './requester.js';

(() => {
    const additionalInformation = {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        loginForm: './templates/login/loginForm.hbs'
    }
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');
        this.get('index.html', loadHomePage);
        this.get('#/', loadHomePage);
        this.get('#/home', loadHomePage);
        this.get('#/about', loadAboutPage);
        this.get('#/login', loadLoginPage);
        this.post('#/login', loginProcess);
        this.get('#/register', loadRegisterPage);
        this.post('#/register', registerProcess);
        this.get('#/logout', logout);
        this.get('#/catalog', loadCatalogPage);
    });
    function saveUserInfo(res) {
        sessionStorage.setItem('username', res['username']);
        sessionStorage.setItem('authtoken', res._kmd['authtoken']);
    }
    function getUserInfo(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken');
        ctx.username = sessionStorage.getItem('username');
    }
    function loadHomePage(ctx) {
        getUserInfo(ctx);
        this.loadPartials(additionalInformation)
            .then(function () {
                this.partial('./templates/home/home.hbs');
            });
    }
    function loadAboutPage(ctx) {
        getUserInfo(ctx);
        this.loadPartials(additionalInformation)
            .then(function () {
                this.partial('./templates/about/about.hbs');
            });
    }
    function loadLoginPage(ctx) {
        this.loadPartials(additionalInformation)
            .then(function () {
                this.partial('./templates/login/loginPage.hbs');
            });
    }
    function loadRegisterPage(ctx) {
        additionalInformation['registerForm'] = './templates/register/registerForm.hbs';
        this.loadPartials(additionalInformation)
            .then(function () {
                this.partial('./templates/register/registerPage.hbs');
            });
    }
    function loadCatalogPage(ctx) {
        getUserInfo(ctx);
        get('appdata', 'teams', 'Kinvey')
            .then(data => {
                ctx['name'] = data.name;
                ctx['comment'] = data.comment;
            })
            .catch(console.error)
        additionalInformation['teamControls'] = './templates/catalog/teamControls.hbs';
        additionalInformation['teamMember'] = './templates/catalog/teamMember.hbs';
        this.loadPartials(additionalInformation)
            .then(function () {
                this.partial('./templates/catalog/details.hbs');
            });
    }
    function loginProcess(ctx) {
        const { username, password } = ctx.params;
        post('user', 'login', 'Basic', { username, password })
            .then(res => saveUserInfo(res))
            .then(res => ctx.redirect('#/home'))
            .catch(console.error)
    }
    function registerProcess(ctx) {
        const { username, password, repeatPassword } = ctx.params;
        if (typeof username === 'string' && password === repeatPassword) {
            post('user', '', 'Basic', { username, password })
                .then(res => saveUserInfo(res))
                .then(res => ctx.redirect('#/home'))
                .catch(console.error)
        }
        else {
            alert('Invalid input parameters!');
        }
    }
    function logout(ctx) {
        sessionStorage.clear();
        ctx.redirect('#/home');
    }
    app.run();
})()
