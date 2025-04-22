import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../../config/db.js';
import {s2point} from "../../config/sizeToPoint.js";

// get 배송 전체 내역
export const viewShipmentComplete = async (req, res) => {
  //Query Parameters - 해당 정보. req.body랑 다른가?
  //- `year`: number - 조회 연도 (기본: 올해)
  //- `month`: number - 조회 연도 (기본: 이번 달)
  //- `day`: number - 조회 연도 (기본: 오늘 날짜)

  try {
    const userId = req.userId;

    //날짜기준 배송리스트 조회
    const [result] = await pool.query(
        'SELECT * FROM Parcel WHERE ownerId = ?, WHERE date = ?',
        [userId, date]
    );

    //리스트 반환 -  날짜, 리스트(배송정보 내역 - all.)
    /*{
      "status": true,
        "date": "2025-04-12T00:00:00.000Z",
        "data": [
    {
      "trackingCode": "TRK001",
		  "recipientName": "박상혁",
		  "recipientAddr": "서울 강서구 ...",
		  "productName": "시계",
      "status": "COMPLETED",
      "completedAt": "2025-04-11T10:24:00.000Z"
    },
    {
      "trackingCode": "TRK002",
		  "recipientName": "홍길동",
		  "recipientAddr": "서울 강남구 ...",
		  "productName": "운동화",
      "status": "COMPLETED",
      "completedAt": "2025-04-13T10:24:00.000Z"
    }
  ]
    }*/

    //포인트 양식
    const spoints = s2point(size);
    const type = 'USE';

    //포인트 충분 조건 확인. 추후 추가.


    //소모 포인트 테이블 입력
    await pool.query(
        'INSERT INTO PointTransaction ( userid, amount, type, reason ) VALUES (?, ?, ?, ?)',
        [userId, spoints, type, "배송" ]
    );

    //json 양식
    return { status: true, message: '배송 정보가 등록되었습니다.', parcelId: result.insertId, usedPoints: spoints  };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};
