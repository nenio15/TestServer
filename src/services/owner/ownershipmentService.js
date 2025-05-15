import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../../config/db.js';
import {s2point} from "../../config/sizeToPoint.js";
import {pad} from "../../config/pad.js";

// get 배송 전체 내역
export const getShipmentListView = async (req) => {
  //기본 금일 날짜
  const [syear, smonth, sday] = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0].split('-');
  try {
    const year = req.query.year || syear;
    const month = req.query.month || smonth;
    const day = req.query.day || sday;
    const userId = req.userId;

    //ex)2025-04-21  day까지만 확인
    const time = year + '-' + pad(month) + '-' + pad(day);

    //날짜기준 배송리스트 조회 pickupCompletedAt / pickupDate / createdAt - 어느것? 일단 희망날짜 기준으로 소요.
    const [result] = await pool.query(
        'SELECT trackingCode, status FROM Parcel WHERE ownerId = ? AND DATE(pickupScheduledDate) = ?',
        [userId, time]
    );

    //json 양식
    return { status: true, date: time, data: result };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};


// get 배송 완료 내역
/// !!! 배송 기준이 완료 시점이 아닌, pickupdate 기준임. 제 역할 못하는 테스팅용으로 변질됨.
export const getShipmentCompleteView = async (req) => {
  //기본 금일 날짜
  const [syear, smonth, sday] = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0].split('-');
  try {
    const year = req.query.year || syear;
    const month = req.query.month || smonth;
    //const day = req.query.day || sday;
    const userId = req.userId;

    //ex)2025-04-00  month까지 확인
    const time = year + '-' + pad(month);// + '-' + day;

    //날짜기준 배송리스트 조회 ( 월간 확인 )
    const [result] = await pool.query(
        "SELECT trackingCode, recipientName, recipientAddr, productName, status, deliveryCompletedAt FROM Parcel WHERE ownerId = ? AND DATE_FORMAT(pickupScheduledDate, '%Y-%m') = ?",
        [userId, time]
    );

    //json 양식
    return { status: true, date: time, data: result };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};


// get 단일배송정보조회
export const getShipmentDetailView = async (req) => {
  try {
    const track = req.query.track;
    //trackingCode 기준 배송리스트 조회
    const [result] = await pool.query(
        'SELECT * FROM Parcel WHERE trackingCode = ?',
        [track]
    );

    //json 양식
    return { status: true, data: result[0] || {} };
  } catch (err) {
    console.error(err);
    throw new Error('유효하지 않습니다.'); //오류 분류 추후 수정
  }
};

// 단건 배송 화면
export const postShipment = async (req) => {
  const { productName, recipientName, recipientPhone, recipientAddr, detailAddress, size, caution, pickupDate } = req.body;

  if (!productName || !recipientName || !recipientPhone || !recipientAddr || !detailAddress || !size) {
    throw new Error('필수 항목 누락');
  }

  try {
    const userId = req.userId;

    //trackingcode 송장번호 고유 기입 - 수거시 생성
    //parcel 단건 배송정보 입력
    const [result] = await pool.query(
        'INSERT INTO Parcel ( ownerid, productName, size, caution, recipientname, recipientPhone, recipientAddr, detailAddress, pickupDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, productName, size, caution, recipientName, recipientPhone, recipientAddr, detailAddress, pickupDate]
    );

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
