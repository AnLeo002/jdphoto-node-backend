import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  const user = req.body;
  console.log(user["lastname"]);
  try {
    const [users] = await pool.execute(
      `SELECT EXISTS (SELECT 1 FROM users WHERE username = ?) AS userExists`,
      [user.username],
    );
    if (users[0].userExists)res.status(409).json({
        error: "Conflict",
        mensaje: "El usuario ya se encuentra registrado en la base de datos",
      });
    const passwordHash = await bcrypt.hash(user.password, 10);
    await pool.execute(
      "INSERT INTO users (name, lastname,email,username,password) VALUES (?,?,?,?,?)",
      [user.name, user.lastname, user.email, user.username, passwordHash],
    );
    res.status(200).json({
      mensaje: "Usuario registrado correctamente",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Eror en el servidor",
    });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );
    const userFound = users[0];
    if (userFound === undefined || userFound === null)
      res.status(404).json({
        error: "Not found",
        mensaje: "El usuario no se encuentra en la base de datos",
      });
    const passwordValid = await bcrypt.compare(password, userFound.password);
    if (!passwordValid)
      res.status(401).json({
        error: "Unauthorized",
        mensaje: "Autenticación fallida",
      });

    res.status(200).json({
      mensaje: "Autenticacion correcta",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Error en el servidor",
    });
  }
};
const updateUser = async (req, res) => {
  const user = req.body;
  const id = Number.parseInt(req.params.id);
  const fields = ["name", "lastname", "email", "username"];

  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    const currentUser = users[0];
    if (!currentUser) return res.status(404).json({
        error: "Not found",
        mensaje: "El usuario no se encuentra en la base de datos",
      });

    const [exists] = await pool.execute(
      "SELECT EXISTS (SELECT 1 FROM users WHERE (username = ? OR email = ?) AND id != ?) AS userExist",
      [user.username, user.email,id],
    );
    if (exists[0].userExist) return res.status(409).json({
        error: "Conflict",
        mensaje:
          "El nombre de usuario o correo electrónico ya se encuentran registrados en la base de datos",
      });

    const changes = fields
      .filter((field) => user[field] !== currentUser[field])
      .map((field) => [field, user[field]]);

    if (changes.length === 0) return res.status(200).json({
        mensaje: "No existen cambios para guardar en base de datos",
      });
    const setClause = changes.map(([field]) => `${field} = ?`).join(", ");
    const values = changes.map(([, value]) => value);
    console.log(values)
    await pool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);
    res.status(200).json({
      mensaje:"Usuario actualizado correctamente"
    })
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error:"Error en el servidor"
    })
  }
};

export { createUser, login, updateUser };
