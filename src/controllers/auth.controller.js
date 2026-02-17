const bcrypt = require("bcryptjs");
const gerarToken = require("../utils/jwt");
const db = require('../config/sqlite'); // Importando seu banco real

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("Erro SELECT user:", err);
      return res.status(500).json({ error: "Erro banco SELECT" });
    }

    if (user) {
      return res.status(400).json({ error: "Email já existe" });
    }

    try {
      const hash = await bcrypt.hash(password, 10);

      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash],
        function (err) {
          if (err) {
            console.error("Erro INSERT user:", err);
            return res.status(500).json({ error: "Erro banco INSERT" });
          }

          res.status(201).json({ id: this.lastID });
        }
      );
    } catch (e) {
      console.error("Erro hash:", e);
      res.status(500).json({ error: "Erro hash senha" });
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("Erro SELECT login:", err);
      return res.status(500).json({ error: "Erro banco SELECT" });
    }

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    const token = gerarToken(user);
    res.json({ token });
  });
};
