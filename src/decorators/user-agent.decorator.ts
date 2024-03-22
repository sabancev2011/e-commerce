import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const UserAgent = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest<Request>();
    return headers['user-agent'];
});