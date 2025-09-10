const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hotel_sorriso'

});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

// Cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  connection.query(sql, [nome, email, hash], (err, result) => {
    if (err) {
      return res.json({ success: false, msg: 'Erro no cadastro ou e-mail já cadastrado!' });
    }
    res.json({ success: true });
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  connection.query(sql, [email], async (err, results) => {
    if (err) return res.json({ success: false, msg: 'Erro no servidor!' });
    if (results.length === 0) return res.json({ success: false, msg: 'Usuário não encontrado!' });

    const user = results[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (match) {
      res.json({ success: true,redirect: "/historico.html" });
    } else {
      res.json({ success: false, msg: 'Senha incorreta!' });
    }
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
