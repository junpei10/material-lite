import {
  Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output,
  SimpleChange, SimpleChanges, ViewContainerRef
} from '@angular/core';
import { Falsy } from '@material-lite/angular-cdk/utils';
import { MlPortalAttachedRef } from './portal-attached-ref';
import { MlPortalAttachConfig, MlPortalContent, MlPortalData, MlPortalOutlet } from './portal-outlet.service';

interface Changes extends SimpleChanges {
  content: SimpleChange;
  key: SimpleChange;
}

@Directive({
  selector: 'ng-template[mlPortalOutlet]',
  exportAs: 'mlPortalOutlet'
})
export class MlPortalOutletDirective implements OnChanges, OnDestroy {
  @Input('mlPortalOutlet') content: MlPortalContent | Falsy;

  @Input('mlPortalOutletAttachConfig') attachConfig: MlPortalAttachConfig;

  @Input('mlPortalOutletKey') key: string | null = null;
  get isPrivate(): boolean {
    return !this.key;
  }

  @Input('mlPortalOutletDestroyingDuration')
  set setOutletDestroyingDuration(duration: number) {
    this._portalData.destroyingOutletDuration = duration;
  }

  private _attachedEmitter: EventEmitter<MlPortalAttachedRef>;
  @Output('mlPortalOutletAttached') get attachedEmitter(): EventEmitter<MlPortalAttachedRef> {
    return this._attachedEmitter || (this._attachedEmitter = new EventEmitter());
  }

  readonly attachedRef: MlPortalAttachedRef | undefined;

  private _portalData: MlPortalData;

  private _hasInitialized: boolean;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    viewContainerRef: ViewContainerRef,
    private _portalOutlet: MlPortalOutlet
  ) {
    this._portalData = {
      outletElement: elementRef.nativeElement.parentElement!,
      viewContainerRef,
      detachEvents: []
    };
  }

  private _initialize(): void {
    const key = this.key;
    if (key) {
      if (this._portalOutlet.hasPortalData(key)) {
        throw new Error(`
          "mlPortalOutletKey"変数に代入した値はすでに使用されています。重複していない"key"を代入してください。

          1. "[mlPortalOutlet](directive) > [mlPortalOutletKey](@Input)"に値が代入されたとき
        `);

      } else {

        this._portalOutlet.setPortalData(key, this._portalData);
      }
    }

    this._hasInitialized = true;
  }

  ngOnChanges(changes: Changes): void {
    let change: SimpleChange;

    /** @changes key */
    change = changes.key;
    if (change) {
      if (this._hasInitialized) {
        this.ngOnDestroy();
      }

      this._initialize();
    }

    /** @changes content */
    change = changes.content;
    if (change) {
      this.attachedRef?.detach();

      const content: MlPortalContent = change.currentValue;
      if (content) {
        if (!this._hasInitialized) {
          this._initialize();
        }

        const keyOrData = this.key || this._portalData;

        // @ts-ignore: assign the readonly property
        const attachedRef = this.attachedRef =
          this._portalOutlet.attach(content, keyOrData, this.attachConfig);

        if (this._attachedEmitter) {
          this._attachedEmitter.emit(attachedRef);
        }
      }
    }
  }

  ngOnDestroy(): void {
    const key = this.key;
    if (key) {
      // @ts-ignore
      const storage = this._portalOutlet._portalDataStorage;
      const detachEvents = storage.get(key)!.detachEvents;

      const len = detachEvents.length;
      for (let i = 0; i < len; i++) {
        detachEvents[i](true);
      }

      storage.delete(key);

    } else {
      this._portalData.detachEvents[0]?.(true);
    }

    this._hasInitialized = false;
  }
}
