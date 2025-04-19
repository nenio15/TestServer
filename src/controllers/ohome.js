import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

// 소상공인 홈화면
export const getOwnerHome = async (req, res) => {
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

    //기본 인출 정보
    const [point] = await pool.query('SELECT points FROM User WHERE id = ?', [userId]);
    const [plan] = await pool.query('SELECT name FROM SubscriptionPlan WHERE id = ?', [userId]);
    const cur_plan = (plan.length !== 0 ? plan[0] : '미구독');
    //const [driver] = await pool.query('SELECT SubstriptionPlan FROM DriverInfo WHERE id = ?', [userId]);
    const [store] = await pool.query('SELECT adrress, latitude, longitude FROM StoreInfo WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    //const store = stores[0];

    return res.status(200).json({ status: true, data: { store: store, assignedDriver: 'none',
      pickupDate: '', points: [point], subscriptionName: cur_plan} });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
