const bcrypt = require("bcryptjs");
const gerarToken = require("../utils/jwt");
const db = require('../config/sqlite'); // Importando seu banco real

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Verifica no banco se o email existe
db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
  if (err) return res.status(500).json(err);
  if (user) return res.status(400).json({ error: "Email já existe" });

    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      function (err) {
        if (err) return res.status(500).json(err);
        res.status(200).json({ id: this.lastID });
      }
    );
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Senha inválida" });

    const token = gerarToken(user);
    res.json({ token });
  });
};