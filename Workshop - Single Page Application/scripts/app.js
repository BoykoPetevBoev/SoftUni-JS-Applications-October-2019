import { get, post, put, del } from './requester.js'

function saveUserInfo(res) {
    sessionStorage.setItem('username', res['username']);
    sessionStorage.setItem('authtoken', res._kmd['authtoken']);
    sessionStorage.setItem('id', res._id);
    sessionStorage.setItem('names', `${res.firstName} ${res.lastName}`);
}
function getUserInfo(ctx) {
    ctx.loggedIn = sessionStorage.getItem('authtoken');
    ctx.username = sessionStorage.getItem('username');
    ctx.userID = sessionStorage.getItem('id');
    ctx.names = sessionStorage.getItem('names');
}
const templatesPaths = {
    header: './templates/header.hbs',
    footer: './templates/footer.hbs',
    notFound: './templates/notFound.hbs',
    foodInfo: './templates/foodInfo.hbs'
};

(() => {
    const app = Sammy('#rooter', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', function (ctx) {
            checkIfLoggedIn(ctx)
            loadPage(ctx, './templates/main.hbs');
        });
        this.get('#/home', function (ctx) {
            getUserInfo(ctx);
            ctx.loggedIn
                ? addNewInfo(ctx)
                : loadPage(ctx, './templates/main.hbs')

        });
        this.get('#/login', function (ctx) {
            loadPage(ctx, './templates/signIn.hbs');
        });
        this.get('#/register', function (ctx) {
            loadPage(ctx, './templates/signUp.hbs');
        });
        this.get('#/shareRecipe', function (ctx) {
            loadPage(ctx, './templates/shareRecipe.hbs');
        });
        this.get('#/logout', function (ctx) {
            sessionStorage.clear();
            ctx.redirect('#/home');
        });
        this.get('#/home/:id', function (ctx) {
            const id = ctx.params.id;
            get('appdata', `recipes/${id}`, 'Kinvey')
                .then(res => {
                    console.log(res)
                    ctx.meal = res.meal
                    ctx.prepMethod = res.prepMethod
                    ctx.likesCounter = res.likesCounter
                    ctx.ingredients = res.ingredients
                    ctx.foodImageURL = res.foodImageURL
                    // ctx = res
                    // ctx = res
                    // ctx = res
                })
                .then(res => loadPage(ctx, './templates/ingredientsInfo.hbs'))
                .catch(console.error)
        })
        this.post('#/shareRecipe', function (ctx) {
            console.log(ctx)

            const likesCounter = 0;
            const ingredients = ctx.params.ingredients.split(' ');
            const { meal, prepMethod, description, foodImageURL, category } = ctx.params;
            const obj = {
                likesCounter,
                ingredients,
                meal,
                prepMethod,
                description,
                foodImageURL,
                category
            }
            post('appdata', 'recipes', 'Kinvey', obj)
                .then(console.log)
                .then(res => ctx.redirect('#/home'))
                .catch(console.error)
        })
        this.post('#/login', function (ctx) {
            const { password, username } = ctx.params;
            postRequest(ctx, ['user', 'login', 'Basic', { username, password }]);
        });
        this.post('#/register', function (ctx) {
            const { firstName, lastName, password, username, repeatPassword } = ctx.params;
            if (firstName.length < 0 || lastName.length < 3 || username.length < 3) {
                alert('Invalid names');
            }
            else if (password.length < 3 || password !== repeatPassword) {
                alert('Invalid password');
            }
            else {
                postRequest(ctx, ['user', '', 'Basic', { username, firstName, lastName, password }]);
            }
        })
    })
    function addNewInfo(ctx) {
        get('appdata', 'recipes', 'Kinvey')
            .then(res => ctx.data = res.slice(0))
            .then(res => loadPage(ctx, './templates/main.hbs'))
            .catch(console.error)
    }
    function postRequest(ctx, params) {
        post(...params)
            .then(res => saveUserInfo(res))
            .then(res => ctx.redirect('#/home'))
            .catch(console.error)
    }
    function checkIfLoggedIn(ctx) {
        getUserInfo(ctx);
        if (ctx.loggedIn) {
            get('appdata', 'recipes', 'Kinvey')
                .then(console.log)
                .catch(console.error)
        }
    }
    function loadPage(ctx, path) {
        getUserInfo(ctx)
        ctx.loadPartials(templatesPaths)
            .then(function () {
                this.partial(path)
            })
    }
    app.run();
})()
