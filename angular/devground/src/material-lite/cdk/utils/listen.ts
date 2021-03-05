type AddEventListener = EventTarget['addEventListener'];
type RemoveEventListener = EventTarget['removeEventListener'];

export interface ListenedTarget {
  addEventListener: AddEventListener;
  removeEventListener: RemoveEventListener;
}

export function listen(target: ListenedTarget, eventName: string, callback: (event: any) => any): () => void {
  target.addEventListener(eventName, callback);
  return () => target.removeEventListener(eventName, callback);
}

export function createListenedTarget(base: ListenedTarget): ListenedTarget {
  return {
    addEventListener: base.addEventListener.bind(base),
    removeEventListener: base.removeEventListener.bind(base)
  };
}
