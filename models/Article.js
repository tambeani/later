/*
    Articles should be created, retrieved and deleted. Therefore,
    we need the following methods for an Article class,

    Article.all(cb) - return all articles
    Article.find(id,cb) - given an ID, return the corresponding article
    Article.create({title, content}, cb) - create an article with a title and content
    Article.delete(id,cb) - delete an article by ID

*/

const mysql = require('mysql2');
const dbName = 'later';
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: `${dbName}`
});

// Create table if it does not exist
db.query(`CREATE TABLE IF NOT EXISTS article (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    content TEXT
);`);

// cb - callback function; implemented in route handler function

class Article {
    static all(cb) {
        db.query('SELECT * FROM article', cb);
    }

    static find(id,cb) {
        db.query(`SELECT * FROM article WHERE id = ${id}`, cb);
    }
    
    static create(data,cb) {
        const sql = 'INSERT INTO article (title,content) VALUES (?,?);'
        db.query(sql,[data.title, data.content],cb);
    }

    static delete(id,cb) {
        if(!id) return cb(new Error('Please provide an id'));
        db.query(`DELETE FROM article WHERE id = ?;`,id, cb);
    }
}

module.exports = db;
module.exports.Article = Article;
