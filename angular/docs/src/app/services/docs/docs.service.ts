import { Inject, Injectable } from '@angular/core';
import { RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { Observable, Subject } from 'rxjs';
import { Firestore, FIRESTORE } from '../firestore';

export interface DocsCodeData {
  [key: string]: string;
}

@Injectable({
  providedIn: 'platform'
})
export class DocsService {
  private _docRef: ReturnType<Firestore['doc']>;

  private _docsCodeCache: {
    [key: string]: DocsCodeData
  } = {};

  readonly routes: string[];
  readonly routeNames: string[];
  readonly activeRoute: string;
  readonly activeRouteIndex: number;

  constructor(
    @Inject(FIRESTORE) private _firestore: Firestore,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone
  ) {}

  init(type: 'components' | 'cdk' | 'guide', docPath: string, docRoutes?: string[], docRouteNames?: string[]): void {

    const collectionPath = type === 'components'
      ? 'component-docs'
      : type === 'cdk'
        ? 'cdk-docs'
        : 'guide-docs';

    this._docRef = this._firestore
      .collection(collectionPath)
      .doc(docPath);

    // @ts-ignore: assign the readonly variable
    this.routes = docRoutes || ['overview', 'reference', 'example'];

    // @ts-ignore: assign the readonly variable
    this.routeNames = docRouteNames || ['Overview', 'Reference', 'Example'];
  }

  getCode(subCollectionPath: string): Promise<DocsCodeData> {
    const collectionRef = this._docRef.collection(subCollectionPath);
    return this._runOutsideNgZone(() => {
      const cacheRef = this._docsCodeCache;
      const cacheData = cacheRef[subCollectionPath];

      if (cacheData) {
        return new Promise(resolve => resolve(cacheData));

      } else {
        return collectionRef.get().then(result => {
          const data = (result.docs[0]?.data() || {}) as DocsCodeData;
          cacheRef[subCollectionPath] = data;
          return data;
        });
      }
    });
  }

  setActiveRoute(activeRoute: string, activeRouteIndex?: number): void {
    // @ts-ignore: assign the readonly variable
    this.activeRoute = activeRoute;

    // @ts-ignore: assign the readonly variable
    this.activeRouteIndex = activeRouteIndex || this.routes.indexOf(activeRoute);
  }
}
