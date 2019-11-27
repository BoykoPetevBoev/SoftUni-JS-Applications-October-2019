import { get, post, put, del } from './requester.js';

(() => {
    const templatesPaths = {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        loginForm: './templates/login/loginForm.hbs',
        team: './templates/catalog/team.hbs',
        registerForm: './templates/register/registerForm.hbs',
        createForm: './templates/create/createForm.hbs',
        teamMember: './templates/catalog/teamMember.hbs',
        teamControls: './templates/catalog/teamControls.hbs',
        editForm: './templates/edit/editForm.hbs'
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
        this.get('#/create', loadCreateForm);
        this.post('#/create', createTeamProcess);
        this.get('#/catalog/:id', loadTeamPage);
        this.get('#/join/:id', joinTeamProcess);
        this.get('#/edit/:id', loadEditPage);
        this.post('#/edit/:id', updateNewInfo);
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
        this.loadPartials(templatesPaths)
            .then(function () {
                this.partial('./templates/home/home.hbs');
            });
    }
    function loadAboutPage(ctx) {
        getUserInfo(ctx);
        this.loadPartials(templatesPaths)
            .then(function () {
                this.partial('./templates/about/about.hbs');
            });
    }
    function loadLoginPage(ctx) {
        this.loadPartials(templatesPaths)
            .then(function () {
                this.partial('./templates/login/loginPage.hbs');
            });
    }
    function loadRegisterPage(ctx) {
        this.loadPartials(templatesPaths)
            .then(function () {
                this.partial('./templates/register/registerPage.hbs');
            });
    }
    function loadCatalogPage(ctx) {
        getUserInfo(ctx);
        get('appdata', 'teams', 'Kinvey')
            .then(data => {
                ctx.teams = data;
                this.loadPartials(templatesPaths)
                    .then(function () {
                        this.partial('./templates/catalog/teamCatalog.hbs');
                    });
            })
            .catch(console.error)
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
    function loadCreateForm(ctx) {
        getUserInfo(ctx);
        this.loadPartials(templatesPaths)
            .then(function () {
                this.partial('./templates/create/createPage.hbs');
            });
    }
    function createTeamProcess(ctx) {
        const { name, comment } = ctx.params
        post('appdata', 'teams', 'Kinvey', { name, comment })
            .then(res => ctx.redirect('#/catalog'))
            .catch(console.error)
    }
    function loadTeamPage(ctx) {
        getUserInfo(ctx);

        const id = ctx.params.id;

        get('appdata', `teams/${id}`, 'Kinvey')
            .then(data => {
                ctx.name = data.name;
                ctx.comment = data.comment;
                ctx.members = data.members;
                ctx.isAuthor = data._id === id;
                ctx.teamId = data._id;
                ctx.isOnTeam = data.members.includes(id);
                this.loadPartials(templatesPaths)
                    .then(function () {
                        this.partial('./templates/catalog/details.hbs');
                    })
            })
    }
    function joinTeamProcess(ctx) {
        const id = ctx.params.id;
        const newUser = { username: sessionStorage.username };
        get('appdata', `teams/${id}`, 'Kinvey')
            .then(data => {
                data.members.push(newUser)
                put('appdata', `teams/${id}`, 'Kinvey', data)
            })
            .then(res => this.redirect(`#/catalog`))
            .catch(console.error)
    }
    function loadEditPage(ctx) {
        getUserInfo(ctx);
        this.loadPartials(templatesPaths)
            .then(function () {
                this.partial('./templates/edit/editPage.hbs');
            })
    }
    function updateNewInfo(ctx) {
        console.log(ctx.params.id)    
        const { id, name, comment } = ctx.params;
        console.log(id, name, comment)
    }
    app.run();
})()
