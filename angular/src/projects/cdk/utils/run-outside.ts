import { inject, InjectionToken, NgZone } from '@angular/core';

export type RunOutside = NgZone['runOutsideAngular'];
export const RUN_OUTSIDE = new InjectionToken<RunOutside>('`runOutsideAngular` method only', {
  providedIn: 'root',
  factory: () => {
    // @ts-ignore
    const outer = inject(NgZone)._outer;
    return (fn) => outer.run(fn);
  }
});
