# Hooksi (Hooks)
Lightweight events hooking module

Event hooking and construction Base! With multi callbacks support!

Build and support Typescript!

# Install

```sh
npm install hooksi --save
```

# Usage

## Import

```ts
import { Hooks } from 'hooksi';
```

## Construction

```ts
const hooks = new Hooks();
```

Example creating a hook for a class

```ts
constructor() {
    this._hooks = new Hooks(); // construction
}
```

## Typescript definition for the hooks or events

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

## Events or hooks subscriptions and registering

ts

```ts
// example of creating the on() method
public on(name: keyof IHooksDef, callback: IHooksDef[typeof name]) {
    this._hooks.on(name, callback);
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

## Hooking or Execution of an event or hook

```ts
this._hooks.exec('finished', this, {
    ...data,
    executionTime
});

// Within this all the attached and hooked callbacks will be executed

```

Signature go as

```ts
public execAsync(
    hookName: keyof HooksDefinition,
    _this: any, // this context to bind within the callback
    ...args: Parameters<HooksDefinition[typeof hookName]>
): void
```

## Async executions

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
```
To note that each hooked callback through `this._hooks.on()`

Will be treated as a promise! That it returns a promise or not! Promise.resolve() is used internally!

Using async await or return new Promise() are both nice ways.


## Unsubscribe from a hook or event

Will be treated as a promise! That it return a promise or not! Promise.resolve() is used internally
