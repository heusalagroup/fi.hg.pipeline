// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";

export enum StageControllerEvent {

    STAGE_STARTED   = "StageController:stageStarted",
    STAGE_PAUSED    = "StageController:stagePaused",
    STAGE_FINISHED  = "StageController:stageFinished",

    JOB_STARTED   = "StageController:jobStarted",
    JOB_PAUSED    = "StageController:jobPaused",
    JOB_FINISHED  = "StageController:jobFinished",

    STEP_STARTED   = "StageController:stepStarted",
    STEP_PAUSED    = "StageController:stepPaused",
    STEP_FINISHED  = "StageController:stepFinished"

}

export type StageControllerDestructor = ObserverDestructor;

export class StageController {

    private readonly _observer: Observer<StageControllerEvent>;


    public constructor () {
        this._observer = new Observer<StageControllerEvent>("StageController");
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public on (
        name: StageControllerEvent,
        callback: ObserverCallback<StageControllerEvent>
    ): StageControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return 'StageController';
    }

    public toJSON (): Json {
        return {
            type: 'StageController'
        };
    }


    public static Event = StageControllerEvent;

}

export function isStageController (value: any): value is StageController {
    return value instanceof StageController;
}

export default StageController;
