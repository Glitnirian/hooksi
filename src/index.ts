export type THooksMap<HooksDefinition> = Map<
    keyof HooksDefinition,
    HooksDefinition[keyof HooksDefinition][]
>;

export class Hooks<HooksDefinition extends { [name: string]: any }> {
    private _hooksMap: THooksMap<HooksDefinition>;

    constructor() {
        this._hooksMap = new Map();
    }

    /**
     * Subscribe to a hook
     * 
     * Can have as many callbacks as you want!
     * 
     * The order of execution is the order of subscription
     *
     * @template HookName
     * @param {HookName} hookName
     * @param {HooksDefinition[HookName]} callback
     * @returns {this}
     * @memberof Hooks
     */
    public on<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        callback: HooksDefinition[HookName]
    ): this {
        if (!this._hooksMap.has(hookName)) {
            this._hooksMap.set(hookName, []);
        }

        this._hooksMap.get(hookName).push(callback);

        return this;
    }

    /**
     * Unsubscribe a callback by it's ref
     * 
     * Return true if found and removed! False if it wasn't found
     *
     * @template HookName
     * @param {HookName} hookName
     * @param {HooksDefinition[HookName]} callback
     * @returns {boolean} true if removed! false if not found!
     * @memberof Hooks
     */
    public unsubscribe<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        callback: HooksDefinition[HookName]
    ): boolean {
        const hookList = this._hooksMap.get(hookName);

        if (hookList && hookList.length > 0) {
            const callbackIndex = hookList.indexOf(callback);

            if (callbackIndex > -1) {
                hookList.splice(callbackIndex, 1);
                
                if (hookList.length === 0) {
                    this.unsubscribeAll(hookName);
                }

                return true;
            }
        }
   
        return false;
    }

    /**
     * Unsubscribe all callbacks for a hook
     *
     * return true if callbacks where unsubscribed! False if none were already subscribed!
     * 
     * @template HookName
     * @param {HookName} hookName
     * @returns {boolean} true if callbacks where unsubscribed! False if none were already subscribed!
     * @memberof Hooks
     */
    public unsubscribeAll<HookName extends keyof HooksDefinition>(
        hookName: HookName
    ): boolean {
        return this._hooksMap.delete(hookName);
    }

    /**
     * Synchronous Hook execution in code
     * 
     * (That can be too the event emitter)
     * 
     * @template HookName
     * @param {HookName} hookName
     * @param {*} _this this Context in the subscribing callbacks
     * @param {...Parameters<HooksDefinition[HookName]>} args call params (callback passed params)
     * @returns {this}
     * @memberof Hooks
     */
    public exec<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any,
        ...args: Parameters<HooksDefinition[HookName]>
    ): this {
        const hookCallbacks = this._hooksMap.get(hookName);

        if (hookCallbacks) {
            for (let i = 0; i < hookCallbacks.length; i++) {
                hookCallbacks[i].call(_this, ...args);
            }
        }

        return this;
    }

    /**
     * Alias for exec
     * 
     * Emit name alias
     * 
     * May be preferred for readability when using the event emitter pattern
     *
     * @template HookName
     * @param {HookName} hookName
     * @param {*} _this this Context in the subscribing callbacks
     * @param {...Parameters<HooksDefinition[HookName]>} args call params (callback passed params)
     * @returns {this}
     * @memberof Hooks
     */
    public emit<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any,
        ...args: Parameters<HooksDefinition[HookName]>
    ): this {
        return this.exec(hookName, _this, ...args);
    }


    /**
     * Asynchronous Hook execution in code
     *
     * (That can be too the event emitter)
     * 
     * @template HookName
     * @param {HookName} hookName
     * @param {*} _this this Context in the subscribing callbacks
     * @param {...Parameters<HooksDefinition[HookName]>} args call params (callback passed params)
     * @returns {Promise<any>[]}
     * @memberof Hooks
     */
    public execAsync<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any, 
        ...args: Parameters<HooksDefinition[HookName]>
    ): Promise<any>[] {
        const hookCallbacks = this._hooksMap.get(hookName);
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

    /**
     * Alias to execAsync
     * 
     * Emit name alias
     *
     * @template HookName
     * @param {HookName} hookName
     * @param {*} _this this Context in the subscribing callbacks
     * @param {...Parameters<HooksDefinition[HookName]>} args call params (callback passed params)
     * @returns {Promise<any>[]}
     * @memberof Hooks
     */
    public emitAsync<HookName extends keyof HooksDefinition>(
        hookName: HookName,
        _this: any,
        ...args: Parameters<HooksDefinition[HookName]>
    ): Promise<any>[] {
        return this.execAsync(hookName, _this, ...args);
    }

    /**
     * Check if there is a subscriber for a hook
     *
     * @template HookName
     * @param {HookName} hookName
     * @returns {boolean}
     * @memberof Hooks
     */
    public hasSubscriber<HookName extends keyof HooksDefinition>(
        hookName: HookName
    ): boolean {
        const callbacks = this._hooksMap.get(hookName);

        if (callbacks && callbacks.length > 0) {
            return true;
        }

        return false;
    }

    /**
     * Get the list of the hook callbacks
     *
     * @template HookName
     * @param {HookName} hookName
     * @returns {(HooksDefinition[HookName][] | undefined)}
     * @memberof Hooks
     */
    public getHookCallbacks<HookName extends keyof HooksDefinition>(
        hookName: HookName
    ): HooksDefinition[HookName][] | undefined {
        return this._hooksMap.get(hookName) as (HooksDefinition[HookName][] | undefined);
    }

    /**
     * Get the hooks map
     *
     * @returns {THooksMap<HooksDefinition>}
     * @memberof Hooks
     */
    public getHooksMap(): THooksMap<HooksDefinition> {
        return this._hooksMap;
    }
}
