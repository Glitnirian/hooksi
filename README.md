# Hooksi (Hooks)

Lightweight events hooking module!

Hooks, Pub sub, Event emitter! Event listener api!

Smooth integration for any module! And use cases! Small, lightweight and rich to the point!

Event hooking and construction Base! With multi callbacks support! (Bind many callbacks to the same event)

Support of async execution and emitting too (separate methodd -Async version-)! Meaning The hook execution within the code or emitting! Can await for async callbacks to finish (Promises)! To move on to the next thing! Very handy in a lot of situations!  

Can be used as a lightweight event emitter! (`exec` calls are the emitters! `emit` aliases are provided too)

And you subscribe with `on()`

`hasSubscriber()` and `getHookCallbacks()` methods! To both check if there is hooks (subscribers)! And get the list of subscribing callbacks!

(Fully written in typescript and support efficient types inference and autocompletion)

## Install

```sh
npm install hooksi --save
```

## Usage

### Import

```ts
import { Hooks } from 'hooksi';
```

### Construction

```ts
const hooks = new Hooks();
```

Example creating a hook for a class

```ts
constructor() {
    this._hooks = new Hooks(); // construction
}
```

### Typescript definition for the hooks or events

```ts
export interface IHooks<ResourceInfo extends IResourceInfo = any> {
    process: (resourceInfo: ResourceInfo) => void;
    finish: (id: any) => void;
    stopProcess: (id: any) => void;
}
```

Construction and variable:

```ts
class SomeClass {
    private _hooks: Hooks<IHooksDef>;

    constructor() {
        this._hooks = new Hooks();
        // or this._hooks = new Hooks<IHooksDef>();

        // I prefer this one (it comes to the same! If the variable type is already correctly set)
    }
}
```

With typescript type inference for callbacks and exec calls are well handled! And so autocompletion and intellisense in editors (like vscode).

### Events or hooks subscriptions and registering

ts

```ts
// example of creating the on() method
public on<EventName extends keyof IHookDef>(eventName: EventName, callback: IHooksDef[EventName]) {
    this._hooks.on(eventName, callback);
    return this;
}

// Subscribing to a hook
this._hooks.on('MyAmazingHookOrEvent', (data) => {
    // Type inference is well handled for Typescript
    // action here
});

// Another method
function anotherContext() {
    // We can have multiple callbacks hooked at different places!
    // Same logic as addEventListener apply
    this._hooks.on('MyAmazingHookOrEvent', (data) => {
        // action here
    });
}
```

js

```js
// example of creating the on() method
public on(name, callback) {
    this._hooks.on(name, callback);
    return this;
}

this._hooks.on('MyAmazingHookOrEvent', (data) => {
    // action here
});

// Another method
function anotherContext() {
    // We can have multiple callbacks hooked at different places!
    // Same logic as addEventListener apply
    this._hooks.on('MyAmazingHookOrEvent', (data) => {
        // action here
    });
}
```

### Hooking or Execution of an event or hook

Synchronous Hook execution in code

```ts
this._hooks.exec('finished', this, {
    ...data,
    executionTime
});

// Within this all the attached and hooked callbacks will be executed


// Can be chained too
this._hooks.exec('finished', this, {
    ...data,
    executionTime
})
.exec('done', this, {
    ...data,
    executionTime
});

```

Signature go as

```ts
public exec<HookName extends keyof HooksDefinition>(
    hookName: HookName,
    _this: any, // this context to bind within the subscribing callback
    ...args: Parameters<HooksDefinition[HookName]>
): this
```

That can be an event emitter too! And the `emit()` alias is provided too.

### Async executions

Asynchronous Hook execution in code

(support Async hooking and Async operation in the callback)

You handle it the way you want on your code

Signature

```ts
public execAsync(
    hookName: keyof HooksDefinition,
    _this: any,
    ...args: Parameters<HooksDefinition[typeof hookName]>
): Promise<any>[]
```

Example

```ts
const promises = this._hooks.execAsync('onCandleProcessed', this, data);

for (const promise of promises) {
    promise.then(() => {
        // Rest of treatment that need to follow go here
        // And we assured a good async flow 
    });
}

// or

await Promise.all(
    this._hooks.execAsync('onCandleProcessed', this, data)
)

// after hook subscribing callbacks execution ....

```

To note that each hooked callback through `this._hooks.on()`

Will be treated as a promise! That it returns a promise or not! Promise.resolve() is used internally!

Using async await or return new Promise() are both nice ways. And of course any promise!

### Emit aliases

Synchronous

```ts
public emit<HookName extends keyof HooksDefinition>(
    hookName: HookName,
    _this: any,
    ...args: Parameters<HooksDefinition[HookName]>
): this
```

As `exec()` can be chained too!

Asynchronous

```ts
public emitAsync<HookName extends keyof HooksDefinition>(
    hookName: HookName,
    _this: any,
    ...args: Parameters<HooksDefinition[HookName]>
): Promise<any>[]
```

A complete aliases for `exec()` and `execAsync()`. They can be preferred for readability when using the event emitter pattern!

### Unsubscribe from a hook or event

Unsubscribe a callback by it's ref.

return true if callback was unsubscribed! False if it was not found (subscribed) (ref)!

```ts
const cbUnsubscribed = this._hooks.unsubscribe('eventName', callbackInstance);
```

Same logic as with a normal `addEventListener` and `removeEventListener`.

### Unsubscribe all

Unsubscribe all callbacks from a hook (event)!

return true if callbacks where unsubscribed! False if none were already subscribed!

```ts
const hadSubscriptions = this._hooks.unsubscribeAll('eventName');
```

### Check if a hook have Subscribers

```ts
if (this._hooks.hasSubscriber('eventName')) {
    this._hooks.unsubscribe('eventName', this._onEventNameCallback);
}
```

### Get hook callbacks list

```ts
const callbacks = this._hooks.getHookCallbacks('eventName');
```

### get hooks map

Get the hook map!

Signature

```ts
public getHooksMap(): THooksMap<HooksDefinition>

type THooksMap<HooksDefinition> = Map<
    keyof HooksDefinition,
    HooksDefinition[keyof HooksDefinition][]
>
```

Return the internal `Map` object! That map events (hook Names) to there callbacks lists!
