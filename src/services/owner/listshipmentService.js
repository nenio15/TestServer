import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../../config/db.js';
import {s2point} from "../../config/sizeToPoint.js";

// get 배송 전체 내역
export const getShipmentListView = async (req, res) => {
  //기본 금일 날짜
  const [date] = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0].split('-');
  try {
    const year = req.query.year || date[0];
    const month = req.query.month || date[1];
    const day = req.query.day || date[2];
    const userId = req.userId;

    //ex)2025-04-21  day까지만 확인
    const time = year + '-' + month + '-' + day;

    //날짜기준 배송리스트 조회
    const [result] = await pool.query(
        'SELECT trackingCode, status FROM Parcel WHERE ownerId = ? AND DATE(createdAt) = ?',
        [userId, time]
    );

    //json 양식
    return { status: true, date: time, data: [result] };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};
