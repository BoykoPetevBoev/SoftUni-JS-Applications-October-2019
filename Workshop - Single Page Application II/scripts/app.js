import { get, post, put, del } from './requester.js'

function saveUserInfo(res) {
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authtoken', res._kmd.authtoken);
    sessionStorage.setItem('id', res._id);
}
function getUserInfo(ctx) {
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken');
    ctx.id = sessionStorage.getItem('id');
}
const templatesPaths = {
    header: './templates/common/header.hbs',
    footer: './templates/common/footer.hbs',
    notifications: './templates/common/notifications.hbs'
};
(() => {
    const app = Sammy('#eventsHolder', function () {
        this.use('Handlebars', 'hbs');

        this.get('/index.html', function (ctx) {
            loadPage(ctx, './templates/homePages/homePage.hbs');
        })
        this.get('#/home', function (ctx) {
            getUserInfo(ctx)
            ctx.loggedIn
            ? loadHomePage(ctx)
            : loadPage(ctx, './templates/homePages/homePage.hbs')

            function loadHomePage(ctx){
                get('appdata', 'events', 'Kinvey')
                    .then(res => {
                        if(res.length === 0){
                            loadPage(ctx, './templates/homePages/notFound.hbs');
                        }
                        else {
                            ctx.data = res.slice(0);
                            loadPage(ctx, './templates/homePages/events.hbs');
                        }
                    })
                    .catch(err => {
                        loadPage(ctx, './templates/homePages/notFound.hbs');
                        console.log(err)
                    })
            }
        })
        this.get('#/newEvent', function(ctx){
            loadPage(ctx, './templates/userProfile.hbs');
        })
        this.get('#/profile', function(ctx){
            loadPage(ctx, './templates/userProfile.hbs');
        })
        this.get('#/login', function (ctx) {
            loadPage(ctx, './templates/userForms/login.hbs');
        })
        this.get('#/register', function (ctx) {
            loadPage(ctx, './templates/userForms/register.hbs');
        })
        this.get('#/logout', function (ctx) {
            sessionStorage.clear();
            ctx.redirect('#/home');
        })
        this.post('#/register', function (ctx) {
            ctx.error = '';
            ctx.success = '';
            ctx.loading = false;
            const { username, password, rePassword } = ctx.params;
            if (username.length < 3) {
                ctx.error = 'The username should be at least 3 characters long!';
                loadPage(ctx, './templates/userForms/register.hbs');
            }
            else if (password.length < 6) {
                ctx.error = 'The password should be at least 6 characters long!';
                loadPage(ctx, './templates/userForms/register.hbs');
            }
            else if (password !== rePassword) {
                ctx.error = 'The repeat password should be equal to the password!';
                loadPage(ctx, './templates/userForms/register.hbs');
            }
            else {
                ctx.loading = true;
                loadPage(ctx, './templates/userForms/register.hbs');
                post('user', '', 'Basic', { username, password })
                    .then(res => {
                        ctx.success = 'User registration successful.';
                        saveUserInfo(res);
                        loadPage(ctx, './templates/userForms/register.hbs');
                    })
                    .then(res => ctx.redirect('#/home'))
                    .catch(err => {
                        ctx.success = '';
                        ctx.loading = false;
                        ctx.error = `This username is already taken. Try ${username}123.`;
                        loadPage(ctx, './templates/userForms/register.hbs');
                    })
            }
        })
        this.post('#/login', function (ctx) {
            ctx.error = '';
            ctx.success = '';
            ctx.loading = true;
            loadPage(ctx, './templates/userForms/login.hbs');
            const { username, password } = ctx.params;
            post('user', 'login', 'Basic', { username, password })
                .then(res => {
                    saveUserInfo(res);
                })
                .then(res => ctx.redirect('#/home'))
                .catch(err => {
                    ctx.success = '';
                    ctx.loading = false;
                    ctx.error = 'Invalid username or password!';
                    loadPage(ctx, './templates/userForms/login.hbs');
                })
        })
    })
    function loadPage(ctx, path) {
        getUserInfo(ctx);
        ctx.loadPartials(templatesPaths)
            .then(function () {
                this.partial(path)
            })
    }
    app.run();
})()
