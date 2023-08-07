const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3307;
app.use(cors());

const connection = mysql.createConnection({
    host : '127.0.0.1',
    // use this line when locally to refer to the local mysql databse from the Docker container.
    // host: 'host.docker.internal',
    user: 'root',
    password: 'charalampos',
    database: 'reactarticles',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } 
    else {
        console.log("Connection Succesfull");
    }
});

// you should add a table for this ofcourse its for tesing purpose
const users = [
    {
      id: 1,
      username: 'charalampos',
      password: '$2a$10$vOiz/wfKO.KAthKRG./uXebO.BPlGWjyEZ6nW7wGG.OpyS3DKI34a', //password: "charalampos"
    }
  ];

app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }

    if (!result) {
        return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
    }
    //after 1 hour the site will ask for login
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        return res.status(200).json({ token });
    });
});

app.post('/api/articles', (req, res) => {
    var sql = `CREATE TABLE IF NOT EXISTS articles ( 
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        tags JSON
        )`;
    connection.query(sql, (err) => {
        if(err) {
            console.error('Error creating table:', err);
        }
        else {
            console.log("Table created!");
        }
    })
    const { name, slug, image_path, content, date, tags } = req.body;
    const insertQuery = `
        INSERT INTO articles (name, slug, image_path, content, date, tags)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const tagsStringified = JSON.stringify(tags); 
    const values = [name, slug, image_path, content, date, tagsStringified];
    connection.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error('Error creating article:', err);
            res.status(500).send('Error creating article');
        } 
        else {
            console.log('Article created');
            res.send('Article created');
            createRelatedArticles(result.insertId, tagsStringified);
        }
    });
});

app.get('/api/getarticles', (req, res) => {
    const selectQuery = `SELECT * FROM articles`;
    connection.query(selectQuery, (err, results) => {
        if (err) {
        console.error('Error retrieving articles:', err);
        res.status(500).send('Error retrieving articles');
        } else {
        const articles = results.map((result) => ({
            id: result.id,
            name: result.name,
            slug: result.slug,
            image_path: result.image_path,
            content: result.content,
            date: result.date,
            tags: JSON.stringify(result.tags),
        }));
        res.json(articles);
        }
    });
});

app.post('/api/getarticleinfo', (req, res) => {
    const { id } = req.body;
    const query = `
    SELECT * FROM articles
        WHERE id = ?;
    `;
    connection.query(query, [id],(err, results) => {
        if (err) {
            console.error('Error retrieving articles info:', err);
            res.status(500).send('Error retrieving articles info');
        }
        else {
            res.json(results);
        }
    });
});

app.post('/api/getarticlesrelated', (req, res) => {
    const { id } = req.body;
    const query = `
        SELECT a.*
        FROM articles a
        JOIN related_articles ra ON a.id = ra.related_article_id
        WHERE ra.article_id = ?;
    `;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error retrieving articles info:', err);
            res.status(500).send('Error retrieving articles info');
        }
        else {
            res.json(results);
        }
    });
});

const createRelatedArticles = (itemId, tagsStringified) => {
    const createRelatedTable = `
        CREATE TABLE IF NOT EXISTS related_articles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        article_id INT,
        related_article_id INT,
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (related_article_id) REFERENCES articles(id)
        )
    `;
    const tags = JSON.parse(tagsStringified);
        connection.query(createRelatedTable, (err) => {
        if (err) {
            console.error('Error creating related_articles table:', err);
        } 
        else {
            console.log('Related Articles table created!');
            const insertRelatedArticles = `
                INSERT INTO related_articles (article_id, related_article_id)
                VALUES (?, ?), (?, ?), (?, ?)
            `;
            const relatedArticleIds = [tags[0], tags[1], tags[2]];
            const values = relatedArticleIds.flatMap(relatedArticleId => [itemId, relatedArticleId]);
            connection.query(insertRelatedArticles, values, (err) => {
                if (err) {
                    console.error('Error inserting related articles:', err);
                }
                else {
                    console.log('Related articles inserted successfully');
                }
            });
        }
    });
};
app.listen(port, () => {
  console.log(`Server is on HOHOHOHO ${port}`);
});