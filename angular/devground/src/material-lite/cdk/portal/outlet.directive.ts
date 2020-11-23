import { Attribute, Directive, ViewContainerRef, OnDestroy, Input, Output, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { MlPortalAttachedRef } from './attached-ref';
import { MlPortalAttachConfig, MlPortalAttachContent, MlPortalOutlet, MlPortalOutletData, MlPortalOutletServiceBase } from './outlet.service';


@Directive() // tslint:disable-next-line:max-line-length directive-class-suffix
export abstract class MlPortalOutletDirectiveBase<R extends MlPortalAttachedRef, D extends MlPortalOutletData, C extends MlPortalAttachConfig> implements OnDestroy, OnChanges {

  abstract attachContent: MlPortalAttachContent | null;
  abstract attachConfig: C | undefined;

  /**
   * @example
   * output('...attachedRef') getAttachedRef = this._getPrivateAttachedRefEmitter;
   */
  abstract getAttachedRef: EventEmitter<R>;
  protected get _getPrivateAttachedRefEmitter(): EventEmitter<R> {
    let attachedRef = this._privateAttachedRefEmitter;
    if (!attachedRef) {
      attachedRef = this._privateAttachedRefEmitter = new EventEmitter();
    }
    return attachedRef;
  }
  protected _privateAttachedRefEmitter: EventEmitter<R> | null;

  protected _privateCurrentAttachedRef: R | undefined;


  /**
   * @description
   * `_key`が存在している場合`undefined`
   * `_key`が存在していない場合`D`
   *
   * @example
   * _privateOutletData = _key ? undefined : D
   */
  protected _privateOutletData: D | undefined;

  constructor(
    protected _key: string | undefined,
    protected _outletService: MlPortalOutletServiceBase<R, D, C>,
  ) { }

  protected _init(data: D): void {
    const key = this._key;
    const publicStorage = this._outletService.publicOutletDataStorage;

    if (key) {
      publicStorage.has(key)
        ? console.warn('重複した`key`をもつ`outlet`が設置されたため、あとから設置された`outlet`は利用できません')
        : publicStorage.set(key, data);

    } else {
      this._privateOutletData = data;
    }
  }

  ngOnDestroy(): void {
    this._key
      ? this._outletService.detachAll(this._key)
      : this._privateOutletData!.detachEvents[0]();
  }

  ngOnChanges(): void {
    if (this.attachContent) {
      this._privateCurrentAttachedRef?.detach();

      const newRef = this._privateCurrentAttachedRef =
        this._outletService.attach(
          this.attachContent,
          (this._key) ? this._key : this._privateOutletData!,
          this.attachConfig
        );

      this.attachContent = null;

      if (this._privateAttachedRefEmitter) {
        this._privateAttachedRefEmitter.emit(newRef);
      }
    }
  }
}


/* tslint:disable:no-input-rename no-output-rename */
@Directive({
  selector: '[mlPortalOutlet]',
})
export class MlPortalOutletDirective extends MlPortalOutletDirectiveBase<MlPortalAttachedRef, MlPortalOutletData, MlPortalAttachConfig> {
  @Input('mlPortalOutlet') attachContent: MlPortalAttachContent;
  @Input('mlPortalAttachConfig') attachConfig: MlPortalAttachConfig;
  @Output('mlPortalAttachedRef') getAttachedRef = this._getPrivateAttachedRefEmitter;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    viewContainerRef: ViewContainerRef,
    @Attribute('key') key: string,
    portalOutlet: MlPortalOutlet
  ) {
    super(key, portalOutlet);

    this._init({
      outletElement: elementRef.nativeElement.parentElement!,
      viewContainerRef,
      detachEvents: []
    });
  }

}
