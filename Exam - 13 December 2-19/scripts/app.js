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
    notifications: "./templates/common/notifications.hbs",
    header: './templates/common/header.hbs',
    footer: './templates/common/footer.hbs'
};
const notifications = {
    error: () => document.getElementById('errorBox'),
    loading: () => document.getElementById('loadingBox'),
    success: () => document.getElementById('successBox')
};
(() => {
    const app = Sammy('#body', function () {
        this.use('Handlebars', 'hbs');

        this.get('/index-Skeleton.html', function (ctx) {
            loadPage(ctx, './templates/home.hbs');
        });
        this.get('#/', function (ctx) {
            loadPage(ctx, './templates/home.hbs');
        });
        this.get('#/login', function (ctx) {
            loadPage(ctx, './templates/user/login.hbs');
        });
        this.post('#/login', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            const { username, password } = ctx.params;
            post('user', 'login', 'Basic', { username, password })
                .then(res => {
                    clearInput("inputUsername");
                    clearInput("inputPassword");
                    saveUserInfo(res);
                })
                .then(() => ctx.redirect('#/dashboard'))
                .catch(() => { errorMessage('Invalid username or password!') });
        });
        this.get('#/register', function (ctx) {
            loadPage(ctx, './templates/user/register.hbs');
        });
        this.post('#/register', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            const { username, password, repeatPassword } = ctx.params;
            if (username.length < 3) {
                errorMessage('The username should be at least 3 characters long!');
            }
            else if (password.length < 3) {
                errorMessage('The password should be at least 3 characters long!');
            }
            else if (password !== repeatPassword) {
                errorMessage('The repeat password should be equal to the password!');
            }
            else {
                post('user', '', 'Basic', { username, password })
                    .then(res => {
                        clearInput("inputUsername");
                        clearInput("inputPassword");
                        clearInput("inputRepeatPassword");
                        saveUserInfo(res)
                    })
                    .then(() => ctx.redirect('#/dashboard'))
                    .catch(() => { errorMessage(`This username is already in use. You can try with ${username}123.`) })
            }
        });
        this.get('#/logout', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            post('user', '_logout', 'Kinvey', {})
                .then(() => { sessionStorage.clear() })
                .then(() => { ctx.redirect('#/') })
                .catch(() => { errorMessage('Something went wrong!') })
        });
        this.get('#/dashboard', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            get('appdata', 'ideas', 'Kinvey')
                .then(res => {
                    ctx.res = res
                    loadPage(ctx, './templates/dashboard.hbs');
                })
                .catch(() => { errorMessage('Something went wrong!') })
        });
        this.get('#/create', function (ctx) {
            loadPage(ctx, './templates/create.hbs');
        });
        this.post('#/create', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            getUserInfo(ctx);
            const { title, description, imageURL } = ctx.params;
            const obj = {
                title,
                description,
                imageURL,
                creator: ctx.username,
                likes: 0,
                comments: []
            };
            if (title.length < 6) {
                errorMessage('The title should be at least 6 characters long!');
            }
            else if (description.length < 10) {
                errorMessage('The description should be at least 10 characters long!');
            }
            else if (!imageURL.startsWith('http://') && !imageURL.startsWith('https://')) {
                errorMessage('The image should start with "http://" or "https://"!');
            }
            else {
                post('appdata', 'ideas', 'Kinvey', obj)
                    .then(() => {
                        clearInput('title')
                        clearInput('title')
                        clearInput('imageURl')
                    })
                    .then(() => { ctx.redirect('#/dashboard') })
                    .catch(() => { errorMessage('Something went wrong!') })
            }
        });
        this.get('#/dashboard/:id', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            get('appdata', `ideas/${ctx.params.id}`, 'Kinvey')
                .then(res => {
                    getUserInfo(ctx);
                    ctx.info = res;
                    ctx.admin = res.creator === ctx.username
                    loadPage(ctx, './templates/details.hbs');
                })
                .catch(() => { errorMessage('Something went wrong!') })
        });
        this.get('#/dashboard/:id/delete', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            del('appdata', `ideas/${ctx.params.id}`, 'Kinvey')
                .then(res => {
                    console.log(res)
                    ctx.redirect('#/dashboard');
                })
                .catch(() => { errorMessage('Something went wrong!') })
        });
        this.get('#/dashboard/:id/like', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            const id = ctx.params.id
            get('appdata', `ideas/${id}`, 'Kinvey')
                .then(res => {
                    res.likes++;
                    put('appdata', `ideas/${id}`, 'Kinvey', res)
                        .then(() => { ctx.redirect(`#/dashboard/${id}`) })
                })
                .catch(() => { errorMessage('Something went wrong!') })
        });
        this.post('#/dashboard/:id', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            getUserInfo(ctx);
            const { id, newComment } = ctx.params;
            if (newComment == '') {
                errorMessage('Comment field can not be empty!');
            }
            else {
                const obj = {
                    username: ctx.username,
                    comment: newComment
                }
                get('appdata', `ideas/${id}`, 'Kinvey')
                    .then(res => {
                        res.comments.push(obj)
                        put('appdata', `ideas/${id}`, 'Kinvey', res)
                            .then(() => { ctx.redirect(`#/dashboard/${id}`) })
                    })
                    .catch(() => { errorMessage('Something went wrong!') })
            }
        });
        this.get('#/profile', function (ctx) {
            clearNotifications();
            notifications.loading().style.display = 'block';
            ctx.ideasTitle = [];
            get('appdata', 'ideas', 'Kinvey')
                .then(res => {
                    getUserInfo(ctx);
                    const ideas = res.filter(obj => obj._acl.creator === ctx.id);
                    ctx.ideasNum = ideas.length;
                    ideas.map(obj => ctx.ideasTitle.push(obj.title));
                })
                .then(() => { loadPage(ctx, './templates/user/profile.hbs'); })
                .catch(() => { errorMessage('Something went wrong!') })
        });
    });
    function clearInput(inputID) {
        const input = document.getElementById(inputID);
        input.value = '';
    }
    function loadPage(ctx, path) {
        getUserInfo(ctx);
        ctx.loadPartials(templatesPaths)
            .then(function () {
                this.partial(path)
            })
    }
    function clearNotifications() {
        notifications.loading().style.display = 'none';
        notifications.success().style.display = 'none';
        notifications.error().style.display = 'none';
    }
    function errorMessage(err) {
        clearNotifications();
        notifications.error().innerHTML = err;
        notifications.error().style.display = 'block';
    }
    app.run();
})()
