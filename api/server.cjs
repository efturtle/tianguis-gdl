const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors({
  origin: '*'
}));

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../database/database.sqlite', (err) => {
  if (err) {
    console.error(err);
  }else{
    console.log('Connected to the SQLite database.');
  }
});




// app.get('/', (req, res) => {
//   // res.send('Hello World!')
//   db.all('SELECT * FROM tianguis', [], (err, rows) => {
//     if (err) {
//       throw err;
//     }
//     res.send(rows);
//   });
// });

// app.post('/tianguis', (req, res) => {
  
// });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});