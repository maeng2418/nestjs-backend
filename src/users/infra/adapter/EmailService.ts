import { Injectable } from '@nestjs/common';
// EmailModule에 존재하는 EmailServicefmf ExternalEmailService 타입으로 가져옴
import { EmailService as ExternalEmailService } from 'src/email/email.service';
import { IEmailService } from 'src/users/application/adapter/IEmailService';

@Injectable()
export class EmailService implements IEmailService {
  // EmailModule이 UsersModule과 같은 서비스에 존재하기 때문에 직접 주입받을 수 있다.
  // 하지만 MSA를 적용하여 별개의 서비스로 분리했다면 HTTP 등 다른 프로토콜을 이용하여 호출한다.
  constructor(private emailService: ExternalEmailService) {}

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ): Promise<void> {
    this.emailService.sendMemberJoinVerification(
      emailAddress,
      signupVerifyToken,
    );
  }
}
