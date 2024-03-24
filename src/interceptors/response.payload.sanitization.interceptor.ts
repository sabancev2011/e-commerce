import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponsePayloadSanitizationInterceptor implements NestInterceptor {
  readonly omittedProperties = ['password']
  private isDate = (data: unknown) => Object.prototype.toString.call(data) === '[object Date]';

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => this.sanitizeProperties(data)))
  }

  private sanitizeProperties(data: unknown) {
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeProperties(item))
    }
    if (typeof data === 'object' && data !== null && !this.isDate(data)) {
      return Object.fromEntries(Object.entries(data).filter(([key, value]) => {
          if (!this.omittedProperties.includes(key)) {
            return [key, this.sanitizeProperties(value)]
          }
        })
      );
    }
    return data
  }
}