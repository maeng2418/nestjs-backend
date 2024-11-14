import { LoggerService } from '@nestjs/common';

class MyLogger implements LoggerService {
  log(message: string, ...optionalParmas: any[]): void {
    console.log(message);
  }

  error(message: string, ...optionalParmas: any[]): void {
    console.log(message);
  }

  warn(message: string, ...optionalParmas: any[]): void {
    console.log(message);
  }

  debug?(message: string, ...optionalParmas: any[]): void {
    console.log(message);
  }

  verbose?(message: string, ...optionalParmas: any[]): void {
    console.log(message);
  }
}

export default MyLogger;
