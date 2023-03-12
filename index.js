const express = require('express');
const app = express();
const articles = [{ title: 'Example'}];
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// Supports request bodies encoded as JSON
app.use(bodyParser.json());

// Supports form-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.send('Hello World!');
});

app.get('/articles',(req,res) => {
    res.send(articles);
});

// Need for body-parser
/*
    In order to create articles we need to use 
    body-parsers. Express used to come built-in
    with body-parsers.

    A body-parser understands how to accept
    MIME-encoded POST request bodies and turn 
    them into data you can use in your code.

    Whenever you submit a form, a body-parser is
    involved somewhere in the server-side software.
*/
app.post('/articles',(req,res,next) => {
    const article = {title: req.body.title};
    articles.push(article);
    res.send(article);
});

app.get('/articles/:id',(req,res,next) => {
    const id = req.params.id;
    console.log('Fetching:',id);
    res.send(articles[id]);
});

app.delete('/articles/:id',(req,res,next) => {
    const id = req.params.id;
    console.log('Deleting:',id);
    delete articles[id];
    res.send({ message: 'Deleted'});
});

app.listen(port,() => {
    console.log(`Server is running on ${port}`);
})

module.exports = app