import { Injectable } from '@angular/core';
import { Subscription ,  Subject } from 'rxjs';

export interface IEventListener {
    ignore(): void;
}
interface IBrokeredEventBase {
    name: string;
    emit( data: any ): void;
    listen( next: (data: any) => void ): IEventListener;
}
interface IBrokeredEvent<T> extends IBrokeredEventBase  {
    emit( data: any ): void;
    listen( next: (data: any) => void ): IEventListener;
}
class EventListener implements IEventListener {
    constructor(private subscription: Subscription) {
    }
    public ignore(): void {
        this.subscription.unsubscribe();
    }
}

class BrokeredEvent<T> implements IBrokeredEvent<T> {
    private subject: Subject<T>;
    constructor( public name: string ) {
        this.subject = new Subject<T>();
    }
    public emit( data: T ): void {
        this.subject.next(data);
    }
    public listen(next: (value: T) => void): IEventListener {
        return new EventListener(this.subject.subscribe( next ));
    }
}
@Injectable()
export class EventBrokerService {
    private events: { [name: string]: IBrokeredEventBase };
    constructor() {
        this.events = {};
    }
    public register<T>(eventName: string ): BrokeredEvent<T> {
        let event = this.events[eventName];
        if ( typeof event === 'undefined' ) {
            event = this.events[eventName] = new BrokeredEvent<T>(eventName);
        }
        return event as BrokeredEvent<T>;
    }
    public listen<T>(eventName: string, next: (value: T) => void): IEventListener {
        return this.register<T>(eventName).listen(next);
    }
    public emit<T>(eventName: string, data: T): void {
        return this.register<T>(eventName).emit(data);
    }
}
