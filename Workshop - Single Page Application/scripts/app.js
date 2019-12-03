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
    foodInfo: './templates/foodInfo.hbs',
    notifications: './templates/notifications.hbs'
};
const categoryImages = {
    'Vegetables and legumes/beans': "https://www.eatforhealth.gov.au/sites/default/files/images/the_guidelines/101351132_vegetable_selection_web.jpg",
    'Fruits': "https://img.etimg.com/thumb/msid-69712122,width-640,resizemode-4,imgsize-1226932/eat-your-fruits-and-veggies-to-avoid-strokes.jpg",
    'Grain Food': "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
    'Milk, cheese, eggs and alternatives': "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
    'Lean meats and poultry, fish and alternatives': "https://tastethefood.weebly.com/uploads/5/2/4/1/52410647/4517278_orig.jpg"
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
        this.get("#/home/:id/delete", function (ctx) {
            const id = ctx.params.id;
            del('appdata', `recipes/${id}`)
                .then(res => ctx.redirect('#/home'));
        })
        this.get('#/home/:id', function (ctx) {
            getUserInfo(ctx)
            const id = ctx.params.id;
            get('appdata', `recipes/${id}`, 'Kinvey')
                .then(res => {
                    ctx.author = ctx.userID === res._acl.creator
                    ctx.meal = res.meal
                    ctx.prepMethod = res.prepMethod
                    ctx.likesCounter = res.likesCounter
                    ctx.ingredients = res.ingredients
                    ctx.foodImageURL = res.foodImageURL
                    ctx.id = res._id
                })
                .then(res => loadPage(ctx, './templates/ingredientsInfo.hbs'))
                .catch(console.error)
        })
        this.get("#/home/:id/editRecipe", function (ctx) {
            const id = ctx.params.id
            loadPage(ctx, './templates/editRecipe.hbs')
            get('appdata', `recipes/${id}`, 'Kinvey')
                .then(res => {
                    ctx.meal = res.meal
                    ctx.ingredients = res.ingredients
                    ctx.foodImageURL = res.foodImageURL
                    ctx.id = res._id
                    loadPage(ctx, './templates/editRecipe.hbs')
                })
                .catch(console.error)
        })
        this.post("#/home/:id/editRecipe", function(ctx){
            ctx.error = '';

            const likesCounter = 0;
            const ingredients = ctx.params.ingredients.split(' ');
            const { meal, prepMethod, description, foodImageURL, category } = ctx.params;
            const categoryImageURL = categoryImages[category];
            if (meal.length < 4) {
                ctx.error = 'Meal should be at least 4 characters long!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else if (ingredients.length < 2) {
                ctx.error = 'Ingredients should be at least 2 elements long!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else if (prepMethod.length < 10 || description.length < 10) {
                ctx.error = 'The preparation method and description should be at least 10 characters long each!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else if (category === 'Select category...') {
                ctx.error = 'You need to select category!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else {
                const obj = {
                    likesCounter,
                    ingredients,
                    meal,
                    prepMethod,
                    description,
                    foodImageURL,
                    category,
                    categoryImageURL
                }
                put('appdata', `recipes/${ctx.params.id}`, 'Kinvey', obj)
                    .then(console.log)
                    .then(res => ctx.redirect('#/home'))
                    .catch(console.error)
            }
        })
        this.get("#/home/:id/like", function (ctx) {
            const id = ctx.params.id;
            get('appdata', `recipes/${id}`, 'Kinvey')
                .then(res => {
                    res.likesCounter += 1
                    put('appdata', `recipes/${id}`, 'Kinvey', res)
                })
                .then(res => ctx.redirect(`#/home/${id}`))
                .catch(console.error)
        })
        this.post('#/shareRecipe', function (ctx) {
            ctx.error = '';

            const likesCounter = 0;
            const ingredients = ctx.params.ingredients.split(' ');
            const { meal, prepMethod, description, foodImageURL, category } = ctx.params;
            const categoryImageURL = categoryImages[category];
            if (meal.length < 4) {
                ctx.error = 'Meal should be at least 4 characters long!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else if (ingredients.length < 2) {
                ctx.error = 'Ingredients should be at least 2 elements long!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else if (prepMethod.length < 10 || description.length < 10) {
                ctx.error = 'The preparation method and description should be at least 10 characters long each!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else if (category === 'Select category...') {
                ctx.error = 'You need to select category!';
                loadPage(ctx, './templates/shareRecipe.hbs');
            }
            else {
                const obj = {
                    likesCounter,
                    ingredients,
                    meal,
                    prepMethod,
                    description,
                    foodImageURL,
                    category,
                    categoryImageURL
                }
                post('appdata', 'recipes', 'Kinvey', obj)
                    .then(console.log)
                    .then(res => ctx.redirect('#/home'))
                    .catch(console.error)
            }
        })
        this.post('#/login', function (ctx) {
            ctx.error = '';
            ctx.success = false;
            const { password, username } = ctx.params;
            if (username.length < 3) {
                ctx.error = 'Invalid username!';
                loadPage(ctx, './templates/signIn.hbs');
            }
            else if (password.length < 6) {
                ctx.error = 'Invalid password!';
                loadPage(ctx, './templates/signIn.hbs');
            }
            else {
                ctx.success = true;
                ctx.error = '';
                loadPage(ctx, './templates/signIn.hbs');
                postRequest(ctx, ['user', 'login', 'Basic', { username, password }]);
            }
        });
        this.post('#/register', function (ctx) {
            ctx.error = '';
            ctx.success = false;
            const { firstName, lastName, password, username, repeatPassword } = ctx.params;
            if (firstName.length < 2) {
                ctx.error = 'First name should be at least 2 characters!';
                loadPage(ctx, './templates/signUp.hbs');
            }
            else if (lastName.length < 2) {
                ctx.error = 'Last name should be at least 2 characters!';
                loadPage(ctx, './templates/signUp.hbs');
            }
            else if (username.length < 3) {
                ctx.error = 'Username should be at least 3 characters!';
                loadPage(ctx, './templates/signUp.hbs');
            }
            else if (password.length < 6) {
                ctx.error = 'Password should be at least 6 characters!';
                loadPage(ctx, './templates/signUp.hbs');
            }
            else if (password !== repeatPassword) {
                ctx.error = 'The repeat password should be equal to the password!';
                loadPage(ctx, './templates/signUp.hbs');
            }
            else {
                ctx.error = '';
                ctx.success = true;
                loadPage(ctx, './templates/signUp.hbs');
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
