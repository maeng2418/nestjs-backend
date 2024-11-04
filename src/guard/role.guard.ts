import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class HandlerRolesGuard implements CanActivate {
  // 가드에 Reflector 주입
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // JWT를 검증해서 얻은 유저 ID라고 가정. request.user.id와 같은 값
    const userId = 'user-id';
    const userRole = this.getUserRole(userId);

    // 가드에서 주입받은 Reflector를 이용해서 메타데이터 리스트를 가져옴.
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // DB에서 얻은 값이 메타데이터에 포함되어 있는지 확인
    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string {
    // userId를 이용해서 DB에서 유저의 역할을 가져왔다고 가정하고 그 역할이 admin 이라고 가정
    return 'admin';
  }
}

@Injectable()
export class ClassRolesGuard implements CanActivate {
  // 가드에 Reflector 주입
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // JWT를 검증해서 얻은 유저 ID라고 가정. request.user.id와 같은 값
    const userId = 'user-id';
    const userRole = this.getUserRole(userId);

    // 가드에서 주입받은 Reflector를 이용해서 메타데이터 리스트를 가져옴.
    const roles = this.reflector.get<string[]>('roles', context.getClass());

    // DB에서 얻은 값이 메타데이터에 포함되어 있는지 확인
    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string {
    // userId를 이용해서 DB에서 유저의 역할을 가져왔다고 가정하고 그 역할이 admin 이라고 가정
    return 'admin';
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  // 가드에 Reflector 주입
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // JWT를 검증해서 얻은 유저 ID라고 가정. request.user.id와 같은 값
    const userId = 'user-id';
    const userRole = this.getUserRole(userId);

    // 가드에서 주입받은 Reflector를 이용해서 메타데이터 리스트를 가져옴.
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // DB에서 얻은 값이 메타데이터에 포함되어 있는지 확인
    if (roles?.length > 0) {
      return roles.includes(userRole);
    }
    return true;
  }

  private getUserRole(userId: string): string {
    // userId를 이용해서 DB에서 유저의 역할을 가져왔다고 가정하고 그 역할이 admin 이라고 가정
    return 'admin';
  }
}
