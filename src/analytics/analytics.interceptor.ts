import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private readonly analyticsService: AnalyticsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url: string = request.url;

    // Skip tracking for analytics endpoints themselves to avoid recursion
    if (url.includes('/analytics/') || url.includes('/admin/')) {
      return next.handle();
    }

    const userId: string | null = request.user?.sub ?? null;
    const action = `${method} ${url.split('?')[0]}`;

    return next.handle().pipe(
      tap(() => {
        this.analyticsService.track({
          userId,
          action,
          target: url.split('?')[0],
          ipAddress: request.ip,
        }).catch(() => { /* fire-and-forget */ });
      }),
    );
  }
}
