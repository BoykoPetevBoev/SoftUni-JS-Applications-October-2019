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
const notifications = {
    error: () => document.getElementById('errorNotification'),
    loading: () => document.getElementById('loadingNotification'),
    success: () => document.getElementById('successNotification')
};

(() => {
    const app = Sammy('#exam', function () {
        this.use('Handlebars', 'hbs');

        this.get('/index.html', function (ctx) {
            loadPage(ctx, './templates/common/home.hbs');
        });
        this.get('#/', function (ctx) {
            loadPage(ctx, './templates/common/home.hbs');
        });
        this.get('/', function (ctx) {
            loadPage(ctx, './templates/common/home.hbs');
        });
        this.get('#/login', function (ctx) {
            loadPage(ctx, './templates/user/login.hbs')
        });
        this.get('#/register', function (ctx) {
            loadPage(ctx, './templates/user/register.hbs')
        });
        this.get('#/logout', function (ctx) {
            notifications.loading().style.display = 'block';
            post('user', '_logout', 'Kinvey', {})
                .then(res => {
                    sessionStorage.clear();
                    ctx.redirect('#/')
                })
                .catch(console.log)
        })
        this.post('#/login', function (ctx) {
            const { username, password } = ctx.params;
            notifications.error().style.display = 'none';
            notifications.loading().style.display = 'block';
            post('user', 'login', 'Basic', { username, password })
                .then(res => saveUserInfo(res))
                .then(() => ctx.redirect('#/'))
                .catch(err => {
                    notifications.error().innerHTML = 'Invalid username or password'
                    notifications.error().style.display = 'block';
                    notifications.loading().style.display = 'none';
                    console.log(err)
                })
        })
        this.post('#/register', function (ctx) {
            const { username, password, rePassword } = ctx.params;
            if (username.length < 3) {
                notifications.error().style.display = 'block';
                notifications.error().innerHTML = 'Invalid username';
            }
            else if (password.length < 5) {
                notifications.error().innerHTML = 'Your password must be at least 5 symbols!';
                notifications.error().style.display = 'block';
            }
            else if (password !== rePassword) {
                notifications.error().innerHTML = 'Your password does not mactch!';
                notifications.error().style.display = 'block';
            }
            else {
                notifications.error().style.display = 'none';
                notifications.loading().style.display = 'block';
                post('user', '', 'Basic', { username, password })
                    .then(res => saveUserInfo(res))
                    .then(res => ctx.redirect('#/'))
                    .catch(console.log)
            }
        });
        this.get('#/createCause', function (ctx) {
            loadPage(ctx, './templates/createForm.hbs')
        });
        this.post('#/createCause', function (ctx) {
            const { cause, description, neededFunds, pictureUrl } = ctx.params;
            if(!cause || !description || !neededFunds || !pictureUrl){
                notifications.error().innerHTML = 'All fields must be filled correctly!';
                notifications.error().style.display = 'block';
            }
            else {
                notifications.error().innerHTML = 'All fields must be filled correctly!';
                notifications.error().style.display = 'none';
                notifications.loading().style.display = 'block';
                post('appdata', 'causes', 'Kinvey ', {
                    cause,
                    description,
                    neededFunds,
                    pictureUrl,
                    donors: [],
                    collectedFunds: 0
                })
                .then(res => ctx.redirect('#/dashboard'))
                .catch(console.log)
            }
        });
        this.get('#/dashboard', function(ctx){
            notifications.loading().style.display = 'block'
            get('appdata', 'causes', 'Kinvey')
            .then(res => ctx.causes = res)
            .then(() => loadPage(ctx, './templates/dashboard.hbs'))
            .catch(console.error)
        });
        this.get('#/dashboard/:id', function(ctx){
            notifications.loading().style.display = 'block';
            getUserInfo(ctx);
            get('appdata', `causes/${ctx.params.id}`, 'Kinvey')
                .then(res => {
                    ctx.cause = res;
                    ctx.isAdmin = ctx.id === res._acl.creator;
                })
                .then(() => loadPage(ctx, './templates/details.hbs'))
                .catch(console.log)
        });
        this.post('#/dashboard/:id', function(ctx){
            const { currentDonation, id} = ctx.params;
            if(currentDonation === ''){
                notifications.error().innerHTML = 'Please enter a valid donation!';
                notifications.error().style.display = 'block';
            }
            else{
                notifications.error().style.display = 'none';
                notifications.loading().style.display = 'block';
                getUserInfo(ctx);
                get('appdata', `causes/${id}`, 'Kinvey')
                .then(res => {
                    res.collectedFunds += Number(currentDonation);
                    if(!res.donors.includes(ctx.username)){
                        res.donors.push(ctx.username);
                    }
                    put('appdata', `causes/${id}`, 'Kinvey', res);
                })
                .then(() => ctx.redirect(`#/dashboard/${id}`))
                .catch(console.error)
            }
        })
        this.get('#/dashboard/:id/delete', function(ctx){
            notifications.loading().style.display = 'block';
            del('appdata', `causes/${ctx.params.id}`, 'Kinvey')
                .then(() => ctx.redirect('#/dashboard'))
        });
    });
    function loadPage(ctx, path) {
        getUserInfo(ctx);
        ctx.loadPartials(templatesPaths)
            .then(function () {
                this.partial(path)
            })
    }
    app.run();
})()
