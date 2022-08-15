import { EventCallback } from "../types";

export class EventController {
  private _eventCallbacks: EventCallback[];

  constructor() {
    this._eventCallbacks = [];
  }

  public on(eventCallback: EventCallback) {
    this._eventCallbacks.push(eventCallback);
  }

  public off(eventObj?: Partial<EventCallback>) {
    // remove specific event callback
    if (eventObj) {
      if (eventObj.callback) {
        this._eventCallbacks = this._eventCallbacks.filter(
          (eventCallback: EventCallback) =>
            eventCallback.event !== eventObj.event ||
            eventCallback.callback !== eventObj.callback
        );
      } // No callback to remove, remove entire event
      else {
        this._eventCallbacks = this._eventCallbacks.filter(
          (eventCallback: EventCallback) =>
            eventCallback.event !== eventObj.event
        );
      }
    } else {
      this._eventCallbacks = [];
    }
  }

  public trigger(event: string, result?: any): void {
    let eventCallbacks: EventCallback[] = this._eventCallbacks.filter(
      (eventCallback: EventCallback) => eventCallback.event === event
    );

    if (eventCallbacks?.length) {
      eventCallbacks.forEach((eventCallback: EventCallback) => {
        eventCallback.callback(result);
      });
    }
  }
}
