import express from 'express';
import dotenv from 'dotenv';
import signupRouter from '.routes/signup.js'
import loginRouter from '.routes/login.js'

dotenv.config();

const app = express();
app.use(express.json());

// 라우트 예시
app.get('/', (req, res) => {
  res.send('Hello, MongoDB Backend!');
});
app.use('/auth', signupRouter);
app.use('/auth', loginRouter);

export default app;
