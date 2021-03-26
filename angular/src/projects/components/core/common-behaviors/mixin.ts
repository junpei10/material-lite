export type NoConstructor<T> = new () => T;

export type MixinFactory = (base: NoConstructor<any>) => NoConstructor<any>;

// (string | number) => (string & number)
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// 引数に代入された値にかかわる型を、すべて足したクラスの型を作る
type MixinReturns<T extends MixinFactory[]> =
  NoConstructor<UnionToIntersection<InstanceType<ReturnType<T[number]>>>>;

const mixinClassFactoryStorage: { [n: number]: NoConstructor<any> } = {};
const MixinBase = class {};

export function mixinBundleFactory<T extends MixinFactory[]>(...mixins: T): MixinReturns<T> {
  const mixinLen = mixins.length;

  let key = 0;

  for (let i = 0; i < mixinLen; i++) {
    key += mixins[i].prototype.id;
  }

  let bundleClass = mixinClassFactoryStorage[key];
  if (bundleClass) {
    return bundleClass;

  } else {
    bundleClass = MixinBase;
  }

  for (let i = 0; i < mixinLen; i++) {
    const mixin = mixins[i];
    bundleClass = mixin(bundleClass);
  }

  return (mixinClassFactoryStorage[key] = bundleClass);
}
