export function listen(target: EventTarget, eventName: string, callback: (event: any) => any): () => void {
  target.addEventListener(eventName, callback);
  return () => target.removeEventListener(eventName, callback);
}
