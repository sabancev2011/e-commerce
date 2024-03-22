import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { map } from "rxjs";

@Injectable()
export class PasswordDeleteInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map(data => {
        if (Array.isArray(data)) {
          data.map((item: any) => (item.password ? item.password = undefined : item));
        }
        if (data?.password) data.password = undefined;
        return instanceToPlain(data);
      }),
    );
  }
}