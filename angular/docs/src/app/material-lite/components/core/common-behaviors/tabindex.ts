import { NoConstructor } from './mixin';

export interface HasTabIndex {
  tabIndex: number;
}

export function mixinTabIndex(base: NoConstructor<any>, defaultTabIndex: number = 0): NoConstructor<HasTabIndex> {
  return class extends base {
    private _tabIndex: number = defaultTabIndex;
    defaultTabIndex = defaultTabIndex;

    get tabIndex(): number { return this.disabled ? -1 : this._tabIndex; }
    set tabIndex(value: number) {
      this._tabIndex = value === 0 ? 0 : value || this.defaultTabIndex;
    }
  };
}

mixinTabIndex.prototype.id = 11;
