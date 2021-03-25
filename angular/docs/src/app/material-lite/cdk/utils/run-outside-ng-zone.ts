import { inject, InjectionToken, NgZone } from '@angular/core';

export type RunOutsideNgZone = NgZone['runOutsideAngular'];
export const RUN_OUTSIDE_NG_ZONE = new InjectionToken<RunOutsideNgZone>('`runOutsideAngular` method only', {
  providedIn: 'root',
  factory: () => {
    // @ts-ignore
    const outer = inject(NgZone)._outer;
    return (fn) => outer.run(fn);
  }
});
