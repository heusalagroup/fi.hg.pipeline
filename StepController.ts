// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import { isFunction, isObject } from "../ts/modules/lodash";
import Name from "./types/Name";
import ScriptController from "./ScriptController";

export interface StepController {

    getName () : Name;
    isStarted () : boolean;
    isPaused () : boolean;
    isFinished () : boolean;
    start () : ScriptController;
    pause () : ScriptController;
    stop () : ScriptController;
    destroy (): void;

    on (
        name: string,
        callback: ObserverCallback<string>
    ) : ObserverDestructor;

    toString (): string;

    toJSON (): Json;

}

export function isStepController (value: any): value is StepController {
    return (
        isObject(value)
        && isFunction(value?.destroy)
        && isFunction(value?.on)
        && isFunction(value?.toString)
        && isFunction(value?.getName)
        && isFunction(value?.toJSON)
    );
}

export default StepController;
