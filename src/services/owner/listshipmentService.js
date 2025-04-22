import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../../config/db.js';
import {s2point} from "../../config/sizeToPoint.js";

// get 배송 전체 내역
export const viewShipmentList = async (req, res) => {
  //기본 금일 날짜
  const [date] = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0].split('-');
  try {
    const year = req.query.year || date[0];
    const month = req.query.month || date[1];
    const day = req.query.day || date[2];
    const userId = req.userId;

    const time = year + '-' + month + '-' + day;
    //2025-04-21 06:11:42.208
    //날짜기준 배송리스트 조회
    const [result] = await pool.query(
        'SELECT trackingCode, status FROM Parcel WHERE ownerId = ? AND DATE(createdAt) = ?',
        [userId, time]
    );

    //어유 시발 api 만들거 뭐 없었네 시발? 흠. 이건 이거대로 문제인데. - 페이지. 구독/포인트. 소셜. +택배기사. 홈. 수거.배송.(파일), 지도. s3. ci/cd. (ai?) -> 적절히 해결하고 프론트에 들어가도 되지 않나?
    //해당 문제는 뭐 생각 없으니. 차차 고민해보고.
    /*{ "date": "2025-04-12T00:00:00.000Z", "data": [    ]}*/

    //json 양식
    return { status: true, date: date, data: [result] };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};
