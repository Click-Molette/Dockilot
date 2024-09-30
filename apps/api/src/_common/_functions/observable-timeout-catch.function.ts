import { Logger } from '@nestjs/common'
import { catchError, Observable, throwError, timeout } from 'rxjs'

export const DEFAULT_OBSERVABLE_TIMEOUT_CATCH_OPTIONS = {
  timeout: 10_000,
}

/**
 * Observable timeout catch
 *
 * @param observable Observable
 * @param options { timeout?: number }
 * @returns Observable
 */
export function observableTimeoutCatch<T = any>(
  observable: Observable<T>,
  options?: {
    timeout?: number,
  },
): Observable<T> {
  options = { ...DEFAULT_OBSERVABLE_TIMEOUT_CATCH_OPTIONS, ...options }

  return observable.pipe(
    timeout(options?.timeout),
    catchError((err) => {
      const errorMessage = err.name === 'TimeoutError'
        ? 'Service timeout occurred'
        : 'An error occurred';

      Logger.error(`${errorMessage}: ${err.message}`, 'ObservableTimeoutCatch');

      return throwError(() => new Error(errorMessage));
    })
  )
}
