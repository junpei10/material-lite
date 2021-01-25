import React, { Component } from 'react';
import { MlPortalAttachedRef } from './attached-ref';
import { MlPortalConfig, MlPortalOutletData, MlPortalOutletService, MlPortalOutletServiceBase } from './outlet-service';

type RemoveProps<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };

export interface MlPortalOutletPropsBase<R extends MlPortalAttachedRef, C extends MlPortalConfig> {
  publicKey?: string;
  content?: JSX.Element | null | 'gc';
  config?: C;
  onAttach?: (ref: R) => any;
}

export abstract class MlPortalOutletBase<R extends MlPortalAttachedRef, D extends MlPortalOutletData, C extends MlPortalConfig> extends Component<MlPortalOutletPropsBase<R, C>> {

  /** @description propsのkeyの変更は検知せず、対応もしない */
  key: string | undefined;
  ref: React.RefObject<Element>;

  /** @description propsにkeyが代入されない場合、Service内のデータ保存場所を持ちいらないため、これらの変数（メンバ変数）を用いて保管する */
  protected _privateAttachedRef: R | undefined;
  protected _privateOutletData: D | undefined;

  // protected _additionalOutletData: RemoveProps<D, keyof MlPortalOutletData>;

  constructor(
    props: MlPortalOutletPropsBase<R, C>,
    protected _additionalOutletData: RemoveProps<D, keyof MlPortalOutletData> | undefined,
    protected _outletService: MlPortalOutletServiceBase<R, D, C>
  ) {
    super(props);
    this.key = props.publicKey;
    this.ref = React.createRef();
  }

  abstract render(): JSX.Element;

  componentDidMount(): void {
    const key = this.key;
    const publicStorage = this._outletService.publicOutletDataStorage;

    // @ts-ignore
    const data: D = {
      outletElement: this.ref.current!,
      contents: [],
      detachEvents: [],
      ...this._additionalOutletData
    }

    if (key) {
      publicStorage.has(key)
        ? console.warn('重複した`key`をもつ`outlet`が設置されたため、あとから設置された`outlet`は利用できません')
        : publicStorage.set(key, data);

    } else {
      this._privateOutletData = data;
    }

    this.componentDidUpdate();
  }

  componentWillUnmount(): void {
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

  componentDidUpdate(): void {
    const key = this.key;
    const props = this.props;
    const content = props.content;

    if (content !== 'gc') {
      this._privateAttachedRef?.detach();

      if (content) {
        const newRef = this._privateAttachedRef =
          this._outletService.attach(
            content,
            (key) ? key : this._privateOutletData!,
            props.config
          );

        if (this._privateAttachedRef && props.onAttach) {
          props.onAttach(newRef);
        }
      }
    }
  }
}

export default class MlPortalOutlet extends MlPortalOutletBase<MlPortalAttachedRef, MlPortalOutletData, MlPortalConfig> {
  constructor(props: MlPortalOutletPropsBase<MlPortalAttachedRef, MlPortalConfig>) {
    super(props, undefined, MlPortalOutletService)
  }

  render() {
    return <div className='ml-portal-outlet' ref={this.ref as any}></div>
  }
}
