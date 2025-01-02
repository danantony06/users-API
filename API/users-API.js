const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});




app.get("/", (req, res) =>
{
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


  
    const port = process.env.PORT || 3005;
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });