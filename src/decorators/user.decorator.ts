import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { JwtPayload } from "src/interfaces";

export const User = createParamDecorator((key: keyof JwtPayload, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<Request>();
    return user?.[key] ?? user;
});