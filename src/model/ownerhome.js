import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool, connectDB } from '../config/db.js';

// 유저 정보 조회 API
exports.getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;

  // 헤더 체크
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // JWT 디코딩
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectDB();
    const [users] = await pool.query('SELECT id, email, name, userType, isApproved FROM User WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = users[0];
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
