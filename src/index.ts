type HooksObj = { [name in any]: Function[] };

export class Hooks<HooksDefinition extends { [name: string]: any }> {
    private _hooks: HooksObj;

    constructor() {
        this._hooks = {};
    }

    public on<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        callback: HooksDefinition[HookName]
    ) {
        if (!this._hooks[hookName]) {
            (this._hooks as any)[hookName] = [];
        }

        this._hooks[hookName].push(callback);
    }

    public unsubscribe<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        callback: HooksDefinition[HookName]
    ): void {
        if (this._hooks[hookName] && this._hooks[hookName].length > 0) {
            const callbackIndex = this._hooks[hookName].indexOf(callback);

            if (callbackIndex > -1) {
                this._hooks[hookName].splice(callbackIndex, 1);
                // TODO: may be add key remove
            }
        }
    }

    public exec<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any,
        ...args: Parameters<HooksDefinition[HookName]>
    ): void {
        const hookCallbacks = this._hooks[hookName];
        if (hookCallbacks) {
            for (let i = 0; i < hookCallbacks.length; i++) {
                hookCallbacks[i].call(_this, ...args);
            }
        }
    }

    public execAsync<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any,
        ...args: Parameters<HooksDefinition[HookName]>
    ): Promise<any>[] {
        const hookCallbacks = this._hooks[hookName];
        const promises: Promise<any>[] = [];
        if (hookCallbacks) {
            for (let i = 0; i < hookCallbacks.length; i++) {
                promises.push(
                    Promise.resolve(hookCallbacks[i].call(_this, ...args))
                );
            }
        }

        return promises;
    }

    public getHooks() {
        return this._hooks;
    }
}
