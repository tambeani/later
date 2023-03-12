const express = require('express');
const app = express();
const articles = [{ title: 'Example'}];
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { Article } = require('./models/Article');
const read = require('node-readability')

// Supports request bodies encoded as JSON
app.use(bodyParser.json());

// Supports form-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.get('/health',(req,res) => {
    res.send('Hello World!');
});

/*
    Setting up a route handler
    app.get() - route handler
    /articles - endpoint\
    (req,res,err) - route handler function
*/
app.get('/articles', (req, res, err) => {
    Article.all((err,articles) => {
      if (err) return res.send(err);
      res.send(articles);
    });
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
    const url = req.body.url;
    read(url,(err,result) => {
        if(err || !result) res.status(500).send('Error downloading the article');
        const article = {title: result.title, content: result.content};
        Article.create(article,(err, result) =>{
            if (err) return res.send(err);
            res.send('OK');
        });
    });

});


app.get('/articles/:id',(req,res,next) => {
    const id = req.params.id;
    console.log('Fetching:',id);
    Article.find(id,(err, result) =>{
        if (err) return res.send(err);
        res.send(result);
    })
});

app.delete('/articles/:id',(req,res,next) => {
    const id = req.params.id;
    console.log('Deleting:',id);
    Article.delete(id,(err)=>{
        if(err) return res.send(err);
        res.send({ message: 'Deleted'});
    });
    
});

app.listen(port,() => {
    console.log(`Server is running on ${port}`);
})

module.exports = app