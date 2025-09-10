// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para ler JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados simulado (substitua por um DB real depois)
let usuarios = [
  { nome: 'Cliente Teste', email: 'cliente@teste.com', senha: bcrypt.hashSync('123456', 10), tipo: 'cliente' },
  { nome: 'Admin Teste', email: 'admin@teste.com', senha: bcrypt.hashSync('admin123', 10), tipo: 'master' }
];

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.json({ success: false, msg: 'Usuário não encontrado' });

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return res.json({ success: false, msg: 'Senha incorreta' });

  const redirect = usuario.tipo === 'master' ? '/admin.html' : '/cliente.html';
  res.json({ success: true, redirect });
});

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se o email já existe
  const existe = usuarios.find(u => u.email === email);
  if (existe) return res.json({ success: false, msg: 'Email já cadastrado' });

  // Cria usuário com senha criptografada
  const senhaHash = await bcrypt.hash(senha, 10);
  usuarios.push({ nome, email, senha: senhaHash, tipo: 'cliente' });

  res.json({ success: true, msg: 'Usuário cadastrado com sucesso' });
});

// Rota de teste
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
