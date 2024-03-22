import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC } from 'src/decorators';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        super()
    }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(ctx)
    }

}