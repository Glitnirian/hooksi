export class Hooks<HooksDefinition extends { [name: string]: any }> {
    private _hooks: Map<
        keyof HooksDefinition,
        HooksDefinition[keyof HooksDefinition][]
    >;

    constructor() {
        this._hooks = new Map();
    }

    public on<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        callback: HooksDefinition[HookName]
    ) {
        if (!this._hooks.has(hookName)) {
            this._hooks.set(hookName, []);
        }

        this._hooks.get(hookName).push(callback);
    }

    public unsubscribe<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        callback: HooksDefinition[HookName]
    ): void {
        const hookList = this._hooks.get(hookName);

        if (hookList && hookList.length > 0) {
            const callbackIndex = hookList.indexOf(callback);

            if (callbackIndex > -1) {
                hookList.splice(callbackIndex, 1);
                // TODO: may be add key remove
            }
        }
    }

    public exec<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any,
        ...args: Parameters<HooksDefinition[HookName]>
    ): void {
        const hookCallbacks = this._hooks.get(hookName);

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
        const hookCallbacks = this._hooks.get(hookName);
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
