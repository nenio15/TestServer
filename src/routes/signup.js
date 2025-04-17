import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

dotenv.config();

const router = express.Router();

// 회원가입

router.post('/signup', async (req, res) => {
  const { email, password, name, userType } = req.body;

  if (!email || !password || !name || !userType) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }

  const [exist] = await pool.query('SELECT * FROM User WHERE email = ?', [email])
  if (exist.length > 0) {
    return res.status(400).json({ message: '이미 등록된 이메일입니다' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0];
  try {
    const [result] = await pool.query(
      'INSERT INTO User (email, password, name, userType, isApproved, createdAt)'
      [email, hashedPassword, name, userType, true, date] //관리자 승인은 미구현.
    )

    return res.status(200).json({ message: '성공', userId: result.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 에러' });
  }
});

export default router;
