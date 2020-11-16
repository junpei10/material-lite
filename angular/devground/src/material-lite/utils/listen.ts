export function listen(
  target: {
    addEventListener: EventTarget['addEventListener'],
    removeEventListener: EventTarget['removeEventListener']
  },
  eventName: string, callback: (event: any) => boolean | void
): (() => void) {
  const event = (e: any) => callback(e);
  target.addEventListener(eventName, event);
  return () => { target.removeEventListener(eventName, event); };
}

