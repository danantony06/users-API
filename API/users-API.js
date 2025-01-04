const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
console.log("hello")


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});




app.get("/", (req, res) =>
{
    console.log("hellow ordfk")
    res.json({message: "Welcome to my database!" });
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows); 
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
      }
    });



app.get("/users/:id", async (req,res) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
        res.status(200).json(result.rows); 
        if (result.rows.length === 0) {
            return res.status(404).json({ error: req.params.id });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});







app.post("/users/create", async (req,res) => {
    console.log('this')

    const {query} = req.body;
    res.json({message: req.body.firstname });
    // console.log(req.body)
    // const result = await pool.query(`SELECT * FROM users WHERE first_name = ${req.body.firstname}`);
    // return res.status(200).json(result.rows); 
    // return res.status(404).json({ error: req.params.firstname });
    // const result = await pool.query(`INSERT INTO users (first_name,last_name,email) ${req.params.firstname}`);
    // res.json(result.rows);
    
})



  
    const port = process.env.PORT || 3005;
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });