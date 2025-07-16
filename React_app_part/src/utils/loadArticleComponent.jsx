const loadArticleComponent = (fileName) => 
    import(/* @vite-ignore */ `../articles/${fileName}`);


export default loadArticleComponent;