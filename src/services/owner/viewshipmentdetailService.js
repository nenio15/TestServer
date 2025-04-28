import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../../config/db.js';
import {s2point} from "../../config/sizeToPoint.js";

// get 단일배송정보조회
export const getShipmentDetailView = async (req, res) => {
  try {
    const track = req.query.track;
    //trackingCode 기준 배송리스트 조회
    const [result] = await pool.query(
        'SELECT trackingCode, status FROM Parcel WHERE trackingCode = ?',
        [track]
    );

    //json 양식
    return { status: true, data: result };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};
