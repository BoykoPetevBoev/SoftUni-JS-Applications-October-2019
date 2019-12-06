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

            function loadHomePage(ctx) {
                get('appdata', 'events', 'Kinvey')
                    .then(res => {
                        if (res.length === 0) {
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
        this.get('#/newEvent', function (ctx) {
            loadPage(ctx, './templates/eventsForms/organize.hbs');
        })
        this.get('#/profile', function (ctx) {
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
        this.get('#/home/:id', function (ctx) {
            getUserInfo(ctx);
            get('appdata', `events/${ctx.params.id}`, 'Kinvey')
                .then(res => {
                    ctx.name = res.name;
                    ctx.description = res.description;
                    ctx.imageURL = res.imageURL;
                    ctx.dateTime = res.dateTime;
                    ctx.organizer = res.organizer;
                    ctx.peopleInterestedIn = res.peopleInterestedIn;
                    ctx.isCreator = ctx.id === res._acl.creator;
                    loadPage(ctx, './templates/eventInfo.hbs')
                })
                .catch(err => console.log(err))
        })
        this.get('#/home/:id/join', function (ctx) {
            const id = ctx.params.id
            get('appdata', `events/${id}`, 'Kinvey')
                .then(res => {
                    res.peopleInterestedIn += 1;
                    put('appdata', `events/${id}`, 'Kinvey', res)
                        .then(res => ctx.redirect(`#/home/${id}`))
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
        this.get('#/home/:id/delete', function (ctx) {
            del('appdata', `events/${ctx.params.id}`, 'Kinvey')
                .then(console.log)
                .then(res => ctx.redirect('#/home'))
                .catch(console.log)
        })
        this.get('#/home/:id/edit', function (ctx) {
            get('appdata', `events/${ctx.params.id}`, 'Kinvey')
                .then(res => {
                    ctx.name = res.name;
                    ctx.description = res.description;
                    ctx.imageURL = res.imageURL;
                    ctx.dateTime = res.dateTime;
                    ctx.organizer = res.organizer;
                    ctx.peopleInterestedIn = res.peopleInterestedIn;
                    ctx.eventID = res._id;
                    console.log(ctx.eventID)
                })
                .then(res => loadPage(ctx, './templates/eventsForms/edit.hbs'))
                .catch(err => console.log(err))

        })
        this.post('#/home/:id/edit', function (ctx) {
            console.log(ctx)
            const { dateTime, description, imageURL, name, organizer, peopleInterestedIn } = ctx.params;
            put('appdata', `events/${ctx.params.id}`, 'Kinvey', { dateTime, description, imageURL, name, organizer, peopleInterestedIn })
                .then(console.log)
                .then(res => ctx.redirect(`#/home/${ctx.params.id}`))
                .catch(console.log)
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
        this.post('#/newEvent', function (ctx) {
            ctx.error = '';
            ctx.success = '';
            ctx.loading = false;
            getUserInfo(ctx)
            const { name, dateTime, description, imageURL } = ctx.params;
            const peopleInterestedIn = 0;
            const organizer = ctx.username;
            const regex = /\d{1,2} [A-Z][a-z]+/g;
            if (name.length < 6) {
                ctx.error = 'The event name should be at least 6 characters long!';
                loadPage(ctx, './templates/eventsForms/organize.hbs');
            }
            else if (!regex.test(dateTime)) {
                ctx.error = 'The date should be in format "24 February".';
                loadPage(ctx, './templates/eventsForms/organize.hbs');
            }
            else if (description.length < 10) {
                ctx.error = 'The description should be at least 10 characters long!';
                loadPage(ctx, './templates/eventsForms/organize.hbs');
            }
            else if (!imageURL.startsWith("http://") && !imageURL.startsWith("https://")) {
                ctx.error = 'The image should start with "http://" or "https://".';
                loadPage(ctx, './templates/eventsForms/organize.hbs');
            }
            else {
                ctx.loading = true;
                loadPage(ctx, './templates/eventsForms/organize.hbs');
                post('appdata', 'events', 'Kinvey', { name, dateTime, description, imageURL, peopleInterestedIn, organizer })
                    .then(res => ctx.redirect('#/home'))
                    .catch(err => {
                        ctx.error = 'Something went wrong! Please try again!';
                        loadPage(ctx, './templates/eventsForms/organize.hbs');
                        console.log(err);
                    })
            }
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
