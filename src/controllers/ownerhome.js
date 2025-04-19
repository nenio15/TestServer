import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';
import {json} from "express";

export const owner_home = async (req, res) => {
  const { email } = req.body;
  /*
  STORE info  address. 지도 위도, 경도 /기입이 있느냐 없느냐 묻자면, 지도. 수거? 월은 아니 없어.
  포인트 구독상품
"status": true,
  "data": {
    "store": {
      "address": "서울특별시 강남구 테헤란로 123",
      "latitude": 37.5079,
      "longitude": 127.0584
    },
    "assignedDriver": {
      "name": "이기사",
      "phoneNumber": "010-1234-1234",
      "vehicleNumber": "서울 12가 3456"
    },
    "pickupDate": "2025-04-12T00:00:00.000Z",
    "points": 300,
    "subscriptionName": "Standard Plus"
 */
try{
  //pool.query('SELECT * FROM User WHERE email = ?', []) //해당 양식으로 json 받아서 작성.
  const js = {
    "status": true,
    "data": {
      "store": {
        "address": "서울특별시 강남구 테헤란로 123",
        "latitude": 37.5079,
        "longitude": 127.0584
      },
      "assignedDriver": {
        "name": "이기사",
        "phoneNumber": "010-1234-1234",
        "vehicleNumber": "서울 12가 3456"
      },
      "pickupDate": "2025-04-12T00:00:00.000Z",
      "points": 300,
      "subscriptionName": "Standard Plus"
    }
  };

    res.status(200).json(js);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
    //{
    //     "status": false,
    //     "message": "OWNER 권한이 필요합니다."
    // }
  }
};
