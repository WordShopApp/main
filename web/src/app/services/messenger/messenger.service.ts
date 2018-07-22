import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class MessengerService {
  private _subscriptions;

  constructor () {
    this._subscriptions = {};
  }

  subscribe (topic: string, callback): Subscription {
    return this.addSubscription(topic, callback);
  }

  send (topic: string, message = null) {
    let sub = this._subscriptions[topic];
    if (sub) sub.data.next(message);
  }

  private addSubscription (topic: string, callback): Subscription {
    this.ensureTopicExists(topic);
    return this._subscriptions[topic].observable.subscribe(callback);
  }

  private newTopic () {
    let msg = new BehaviorSubject<any>(null);
    return { data: msg, observable: msg.asObservable() };
  }

  private ensureTopicExists (topic: string): void {
    if (!this._subscriptions[topic]) this._subscriptions[topic] = this.newTopic();
  }
}
