import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
class Logger3Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`2nd Request...`);
    // next(); // 응답을 보내지 않아 무한 로딩이 발생함
    // res.send('DONE'); // 다음 미들웨어로 넘어가지 않고 응답을 보냄

    next();
  }
}

export default Logger3Middleware;
