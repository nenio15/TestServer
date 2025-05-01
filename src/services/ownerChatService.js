import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../config/db.js';

//임시 chat ai
export const postChatAi = async (req) => {
    const { questId } = req.body;
    const userId = req.userId;
    if (!userId) throw new Error('인증 실패: userId 없음');
  
    //질문 id 확인
    const [chat] = await pool.query(`SELECT * FROM ChatbotLog WHERE id = ?`, [questId]);
    if (chat.length === 0) {
      return { status: false, message: '올바르지 않은 질문입니다.'};
    }

    return {
      status: true,
      response: chat[0].response
    };
  };
