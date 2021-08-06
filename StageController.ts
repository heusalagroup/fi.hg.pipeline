// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import JobController, { isJobController } from "./JobController";
import { isArray, map } from "../ts/modules/lodash";

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

    private readonly _observer : Observer<StageControllerEvent>;
    private readonly _name     : Name;
    private readonly _jobs     : JobController[];


    public constructor (
        name: Name,
        jobs: JobController[]
    ) {

        if ( !isName(name) ) throw new TypeError(`Stage name invalid: ${name}`);
        if ( !isArray(jobs, isJobController, 1) ) throw new TypeError(`Stage#${name} must have at least one job`);

        this._name     = name;
        this._jobs     = jobs;
        this._observer = new Observer<StageControllerEvent>(`StageController#${this._name}`);
    }

    public getName () : Name {
        return this._name;
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
            type: 'StageController',
            name: this._name,
            jobs : map(this._jobs, (item: JobController) : Json => item.toJSON())
        };
    }


    public static Event = StageControllerEvent;

}

export function isStageController (value: any): value is StageController {
    return value instanceof StageController;
}

export default StageController;
