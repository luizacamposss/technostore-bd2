// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware para interpretar formulários e JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // altere conforme seu MySQL
  password: '',       // se tiver senha, coloque aqui
  database: 'techstore'
});

// Testar conexão com o banco
db.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('✅ Conectado ao MySQL com sucesso!');
});

// Rota principal (cadastro de produto)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

// Rota para salvar um novo produto
app.post('/salvar', (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || !preco || !estoque) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)';
  db.query(sql, [nome, descricao, preco, estoque], (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err);
      return res.status(500).send('Erro ao salvar o produto.');
    }

    res.send(`
      <h2>Produto cadastrado com sucesso!</h2>
      <p><a href="/">Cadastrar outro</a></p>
      <p><a href="/busca.html">Ir para busca</a></p>
    `);
  });
});

// Rota de busca de produtos
app.get('/api/buscar', (req, res) => {
  const nome = req.query.nome || '';
  const sql = 'SELECT * FROM produtos WHERE nome LIKE ?';
  db.query(sql, [`%${nome}%`], (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
    res.json(results);
  });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
