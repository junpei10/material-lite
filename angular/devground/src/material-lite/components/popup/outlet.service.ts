import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable } from '@angular/core';
import { MlPortalOutletServiceBase } from '@material-lite/angular-cdk/portal';
import { RunOutside, RUN_OUTSIDE } from '@material-lite/angular-cdk/utils';
import { MlPopupAttachConfig, MlPopupAttachedRef, MlPopupOutletData } from './attached-ref';


@Injectable({
  providedIn: 'root'
})
export class MlPopupOutlet extends MlPortalOutletServiceBase<MlPopupAttachedRef, MlPopupOutletData, MlPopupAttachConfig> {
  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(RUN_OUTSIDE) runOutside: RunOutside,
    resolver: ComponentFactoryResolver
  ) { super(document, runOutside, resolver, MlPopupAttachedRef); }
}
