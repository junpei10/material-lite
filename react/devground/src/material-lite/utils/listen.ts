export const listen = (target: HTMLElement | Window, eventName: string, callback: (event: any) => boolean | void): (() => void) => {
  const event = (event: any) => callback(event);
  target.addEventListener(eventName, event);
  return () => { target.removeEventListener(eventName, event) };
}