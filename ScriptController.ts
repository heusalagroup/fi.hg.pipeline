// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";

export enum ScriptControllerEvent {

    SCRIPT_STARTED   = "ScriptController:scriptStarted",
    SCRIPT_PAUSED    = "ScriptController:scriptPaused",
    SCRIPT_FINISHED  = "ScriptController:scriptFinished"

}

export type ScriptControllerDestructor = ObserverDestructor;

export class ScriptController {

    private readonly _observer : Observer<ScriptControllerEvent>;


    public constructor () {
        this._observer = new Observer<ScriptControllerEvent>("ScriptController");
    }

    public on (name : ScriptControllerEvent, callback: ObserverCallback<ScriptControllerEvent>) : ScriptControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return 'ScriptController';
    }

    public toJSON (): Json {
        return {
            type: 'ScriptController'
        };
    }


    public static Event = ScriptControllerEvent;

}

export function isScriptController (value: any) : value is ScriptController {
    return value instanceof ScriptController;
}

export default ScriptController;
