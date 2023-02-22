const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'anildb',
    password:'8328815801a',
    port:5432
});

/*this code is for creating a table in the Postgresql */

// const execute = async (query) => {
//     try {
//         await pool.connect();     // gets connection
//         await pool.query(query);  // sends queries
//         return true;
//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     } finally {
//         await pool.end();         // closes connection
//     }
// };

// const text = `CREATE TABLE "customers" (
// 	"id" SERIAL,
// 	"name" VARCHAR(100) NOT NULL,
// 	"email" VARCHAR(100) NOT NULL,
// 	PRIMARY KEY ("id")
// );`;

// execute(text).then(result => {
//     if (result) {
//         console.log('Table created');
//     }
// });

app.use(express.json());

app.get('/customers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (rows.length === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.post('/customers', async (req, res) => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.put('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('UPDATE customers SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    if (rows.length === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
