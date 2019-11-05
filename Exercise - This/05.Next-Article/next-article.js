function getArticleGenerator(articles) {
    const mainDiv = document.getElementById('content');
    let index = 0;
    return function(){
        if(index < articles.length){
            const article = document.createElement('article');
            article.textContent = articles[index];
            mainDiv.appendChild(article);
            index++;
        }
    }
}
