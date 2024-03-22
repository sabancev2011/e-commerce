import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const { cookies } = ctx.switchToHttp().getRequest<Request>();
    return cookies?.[key] ?? cookies;
});