import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';



export const login = async (req, res) => {
  const { email, password, usertype } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const isOwner = await bcrypt.compare(usertype, user.userType);
    if (!isOwner) {
      return res.status(401).json({ message: '소상공인 또는 택배기사 설정이 잘못되었습니다.'});
    }

    const token = jwt.sign({ userId: user.id, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: '로그인 성공', token });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};
