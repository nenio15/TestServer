import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

dotenv.config();

// 회원가입

export const signup = async (req, res) => {
  const { email, password, name, userType, store, drivearea } = req.body;

  if (!email || !password || !name || !userType) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }

  try{
    const connection = await pool.getConnection();

  const [exist] = await pool.query('SELECT * FROM User WHERE email = ?', [email])
  if (exist.length > 0) {
    return res.status(400).json({ message: '이미 등록된 이메일입니다' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0];
  
  // 관리자 승인 미구현
  const [result] = await pool.query(
      'INSERT INTO User (email, password, name, userType, isApproved, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, userType, true, date] 
  );

  if(userType == "OWNER"){
    //가게 주소, 사업자 등록번호
    await pool.query(
        '', [Store]
    )

  }else if(userType == "DRIVER"){
    //화물 운송 자격증 파일 첨부?
    //운전 경력 증명서 파일 첨부?
    //근무 희망 지역 - 시, 구.

  }

    return res.status(200).json({ message: '성공', userId: result.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 에러' });
  }
};
