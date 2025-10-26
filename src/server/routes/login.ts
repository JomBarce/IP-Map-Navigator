import { Router } from 'express';
import bcrypt from "bcryptjs";

const router = Router();

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

// Sample user
const users: User[] = [
  {
    id: 1,
    email: 'test@email.com',
    password: bcrypt.hashSync("password123", 8),
    name: 'Juan Cruz'
  }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Simulate token
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

export default router;
