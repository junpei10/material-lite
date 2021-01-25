import { Attribute, Directive, ViewContainerRef, OnDestroy, Input, Output, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { MlPortalAttachedRef } from './attached-ref';
import { MlPortalConfig, MlPortalContent, MlPortalOutlet, MlPortalOutletData, MlPortalOutletServiceBase } from './outlet.service';


@Directive() // tslint:disable-next-line:max-line-length directive-class-suffix
export abstract class MlPortalOutletDirectiveBase<R extends MlPortalAttachedRef, D extends MlPortalOutletData, C extends MlPortalConfig> implements OnDestroy, OnChanges {

  abstract content: MlPortalContent | null | undefined | 'gc';
  abstract config: C | undefined;

  /**
   * @description Outputのための変数
   * @example
   * output('...attachedRef') getAttachedRef = this._getAttachedEmitter;
   */
  abstract attachedEmitter: EventEmitter<R>;
  protected get _getAttachedEmitter(): EventEmitter<R> {
    let attachedRef = this._privateAttachedRefEmitter;
    if (!attachedRef) {
      attachedRef = this._privateAttachedRefEmitter = new EventEmitter();
    }
    return attachedRef;
  }
  private _privateAttachedRefEmitter: EventEmitter<R> | null;

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
    public key: string | undefined,
    protected _outletService: MlPortalOutletServiceBase<R, D, C>,
  ) { }

  protected _init(data: D): void {
    const key = this.key;
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
    const key = this.key;
    if (key) {
      const detachEvents = this._outletService.publicOutletDataStorage.get(key)!.detachEvents;
      const length = detachEvents.length;

      for (let i = 0; i < length; i++) {
        detachEvents[i](true);
      }

      this._outletService.publicOutletDataStorage.delete(key);
    } else {
      const detachEvent = this._privateOutletData!.detachEvents[0];
      if (detachEvent as any) {
        detachEvent();
      }
    }
  }

  ngOnChanges(): void {
    const content = this.content;
    if (content !== 'gc') {
      this._privateCurrentAttachedRef?.detach();

      if (content) {
        const newRef = this._privateCurrentAttachedRef =
          this._outletService.attach(
            content,
            (this.key) ? this.key : this._privateOutletData!,
            this.config
          );

        if (this._privateAttachedRefEmitter) {
          this._privateAttachedRefEmitter.emit(newRef);
        }
      }

      // @ts-ignore
      this.attachContent = 'gc';
    }
  }
}

// @dynamic
@Directive({
  selector: '[mlPortalOutlet]',
  exportAs: 'mlPortalOutlet'
})
export class MlPortalOutletDirective extends MlPortalOutletDirectiveBase<MlPortalAttachedRef, MlPortalOutletData, MlPortalConfig> {
  @Input('mlPortalOutlet') content: MlPortalContent;
  @Input('mlPortalOutletConfig') config: MlPortalConfig;
  @Output('mlPortalOutletAttached') attachedEmitter = this._getAttachedEmitter;

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
