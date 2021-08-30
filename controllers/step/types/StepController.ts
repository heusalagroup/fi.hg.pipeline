// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ObserverCallback, ObserverDestructor } from "../../../../ts/Observer";
import Json from "../../../../ts/Json";
import Name from "../../../types/Name";
import ScriptController from "../script/ScriptController";
import Controller, { isController } from "../../types/Controller";
import ControllerState from "../../types/ControllerState";

export interface StepController extends Controller {

    getState () : ControllerState;
    getName () : Name;

    isRunning ()    : boolean;
    isStarted ()    : boolean;
    isPaused ()     : boolean;
    isCancelled ()  : boolean;
    isFinished ()   : boolean;
    isFailed ()     : boolean;
    isSuccessful () : boolean;

    start ()   : ScriptController;
    pause ()   : ScriptController;
    resume ()  : ScriptController;
    stop ()    : ScriptController;
    destroy () : void;

    onStarted (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    onPaused (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    onResumed (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    onCancelled (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    onFailed (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    onFinished (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    onChanged (
        callback: ObserverCallback<string, [StepController]>
    ) : ObserverDestructor;

    toString (): string;

    toJSON (): Json;

}

export function isStepController (value: any): value is StepController {
    return isController(value);
}

export default StepController;
