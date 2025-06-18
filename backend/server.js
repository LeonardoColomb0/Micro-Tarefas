const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET = 'segredosecreto123'; // Troque na produção

app.use(cors());
app.use(bodyParser.json());

// ✅ Conectar ao banco SQLite (arquivo será criado automaticamente)
const db = new sqlite3.Database('./tarefas.db', (err) => {
  if (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
  } else {
    console.log('✅ Banco SQLite conectado.');
  }
});

// ✅ Criar as tabelas, se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      senha TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      texto TEXT,
      data TEXT,
      hora TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);
});

// ✅ Middleware para autenticar token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.usuario = usuario;
    next();
  });
}

// ✅ Cadastro
app.post('/auth/register', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const senhaHash = bcrypt.hashSync(senha, 8);
  const sql = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
  db.run(sql, [email, senhaHash], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
    res.json({ message: 'Usuário cadastrado com sucesso', id: this.lastID });
  });
});

// ✅ Login
app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.get(sql, [email], (err, usuario) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    if (!usuario) return res.status(400).json({ error: 'Usuário não encontrado' });

    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  });
});

// ✅ Listar tarefas
app.get('/tarefas', autenticarToken, (req, res) => {
  const sql = 'SELECT * FROM tarefas WHERE usuario_id = ?';
  db.all(sql, [req.usuario.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    res.json(rows);
  });
});

// ✅ Criar tarefa
app.post('/tarefas', autenticarToken, (req, res) => {
  const { texto, data, hora } = req.body;
  if (!texto) return res.status(400).json({ error: 'Texto da tarefa é obrigatório' });

  const sql = 'INSERT INTO tarefas (usuario_id, texto, data, hora) VALUES (?, ?, ?, ?)';
  db.run(sql, [req.usuario.id, texto, data, hora], function (err) {
    if (err) return res.status(500).json({ error: 'Erro ao adicionar tarefa' });
    res.json({ id: this.lastID, texto, data, hora });
  });
});

// ✅ Atualizar tarefa
app.put('/tarefas/:id', autenticarToken, (req, res) => {
  const { texto, data, hora } = req.body;
  const { id } = req.params;
  if (!texto) return res.status(400).json({ error: 'Texto da tarefa é obrigatório' });

  const sql = 'UPDATE tarefas SET texto = ?, data = ?, hora = ? WHERE id = ? AND usuario_id = ?';
  db.run(sql, [texto, data, hora, id, req.usuario.id], function (err) {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    if (this.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ message: 'Tarefa atualizada' });
  });
});

// ✅ Deletar tarefa
app.delete('/tarefas/:id', autenticarToken, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tarefas WHERE id = ? AND usuario_id = ?';
  db.run(sql, [id, req.usuario.id], function (err) {
    if (err) return res.status(500).json({ error: 'Erro ao remover tarefa' });
    if (this.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ message: 'Tarefa removida' });
  });
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
