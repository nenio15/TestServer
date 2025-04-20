import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../config/db.js';

// 단건 배송 화면
export const postShipment = async (req, res) => {
  const { productName, recipientName, recipientPhone, recipientAddr, detailAddress, size, cation, pickupDate } = req.body;

  try {
    //0.이거 항상 이렇게 받으면, auth header가 항상 필요하다는 것임?
    const userId = req.userId;
    //1.trackingcode 송장번호 고유 기입. - 흠좀무. 이거는 수거시에 생성.?

    const [result] = await pool.query(
        'INSERT INTO Parcel ( ownerid, productName, size, caution, recipientname, recipientPhone, recipientAddr, detailAddress, pickupDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, productName, size, cation, recipientName, recipientPhone, recipientAddr, detailAddress, pickupDate]
    );

    //1.size에 따른 point 소모 차이 -> sizetopoint.js 새로 생성 - 함수사용
    const spoints = 1;
    //2.prisma의 enum타입에 접근 방법.
    //const [type] = await pool.config.poin
    //소모 포인트 기입.
    await pool.query(
        'INSERT INTO PointTransaction ( userid, amount, type, reason ) VALUES (?, ?, ?, ?)',
        [userId, spoints, , "배송" ]
    );

    //json 양식
    return { status: true, message: '배송 정보가 등록되었습니다.', parcelId: result[0].id, usedPoints: spoints  };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};
