document.addEventListener("DOMContentLoaded", () => {
    const articles = document.querySelectorAll("article");
    const videos = document.querySelectorAll("article video");

    function showArticle(articleId) {
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        articles.forEach(article => {
            article.style.display = "none";
        });

        const selected = document.querySelector(`#${articleId}`);
        if (selected) {
            selected.style.display = "flex";

            const video = selected.querySelector("video");
            if (video) video.play();
        }
    }

    document.querySelector("#article-one-button").addEventListener("click", () => {
        showArticle("article-one");
    });
    document.querySelector("#article-two-button").addEventListener("click", () => {
        showArticle("article-two");
    });
    document.querySelector("#article-three-button").addEventListener("click", () => {
        showArticle("article-three");
    });

    showArticle("general-text");
});