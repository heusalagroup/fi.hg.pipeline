// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import StepController from "./StepController";
import { isArray, isRegularObject, isString } from "../ts/modules/lodash";
import { isJobController } from "./JobController";

export enum ScriptControllerEvent {

    SCRIPT_STARTED   = "ScriptController:scriptStarted",
    SCRIPT_PAUSED    = "ScriptController:scriptPaused",
    SCRIPT_FINISHED  = "ScriptController:scriptFinished"

}

export type ScriptControllerDestructor = ObserverDestructor;

export class ScriptController implements StepController {

    private readonly _observer : Observer<ScriptControllerEvent>;
    private readonly _name     : Name;
    private readonly _command  : string;
    private readonly _args     : string[];
    private readonly _env      : {[key: string]: string};

    public constructor (
        name     : Name,
        command  : string,
        args     : string[] = [],
        env      : {[key: string]: string} = {}
    ) {

        if ( !isName(name) ) throw new TypeError(`Script name invalid: ${name}`);
        if ( !isString(command) ) throw new TypeError(`Script#${name} must have a valid command: ${command}`);
        if ( !isArray(args, isString, 0) ) throw new TypeError(`Script#${name} must have a valid args: ${JSON.stringify(args)}`);
        if ( !isRegularObject<string, string>(env, isString, isString) ) throw new TypeError(`Script#${name} must have a valid env: ${JSON.stringify(env)}`);

        this._name     = name;
        this._command  = command;
        this._args     = args;
        this._env      = env;
        this._observer = new Observer<ScriptControllerEvent>(`ScriptController#${name}`);

    }

    public destroy () {
        this._observer.destroy();
    }

    public getName () : Name {
        return this._name;
    }

    public on (name : ScriptControllerEvent, callback: ObserverCallback<ScriptControllerEvent>) : ScriptControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return `ScriptController#${this._name}`;
    }

    public toJSON (): Json {
        return {
            type: 'ScriptController',
            name: this._name,
            args: this._args,
            env: this._env
        };
    }

    public isStarted () : boolean {
        return false;
    }

    public isPaused () : boolean {
        return false;
    }

    public isFinished () : boolean {
        return false;
    }

    public start () : ScriptController {
        return this;
    }

    public pause () : ScriptController {
        return this;
    }

    public stop () : ScriptController {
        return this;
    }


    public static Event = ScriptControllerEvent;

}

export function isScriptController (value: any) : value is ScriptController {
    return value instanceof ScriptController;
}

export default ScriptController;
