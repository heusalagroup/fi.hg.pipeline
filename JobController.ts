// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import StepController, { isStepController } from "./StepController";
import { isArray, map } from "../ts/modules/lodash";
import { isStageController } from "./StageController";

export enum JobControllerEvent {

    JOB_STARTED   = "JobController:jobStarted",
    JOB_PAUSED    = "JobController:jobPaused",
    JOB_FINISHED  = "JobController:jobFinished",

    STEP_STARTED   = "JobController:stepStarted",
    STEP_PAUSED    = "JobController:stepPaused",
    STEP_FINISHED  = "JobController:stepFinished"

}

export type JobControllerDestructor = ObserverDestructor;

export class JobController {

    private readonly _observer : Observer<JobControllerEvent>;
    private readonly _name     : Name;
    private readonly _steps    : StepController[];


    public constructor (
        name  : Name,
        steps : StepController[] = []
    ) {
        if ( !isName(name) ) throw new TypeError(`Job name invalid: ${name}`);
        if ( !isArray(steps, isStepController, 1) ) throw new TypeError(`Job#${name} must have at least one step`);

        this._name     = name;
        this._steps    = steps;
        this._observer = new Observer<JobControllerEvent>(`JobController#${this._name}`);

    }

    public getName () : Name {
        return this._name;
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public on (
        name: JobControllerEvent,
        callback: ObserverCallback<JobControllerEvent>
    ): JobControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return `JobController#${this._name}`;
    }

    public toJSON (): Json {
        return {
            type  : 'JobController',
            name  : this._name,
            steps : map(this._steps, (item: StepController) : Json => item.toJSON())
        };
    }


    public static Event = JobControllerEvent;

}

export function isJobController (value: any): value is JobController {
    return value instanceof JobController;
}

export default JobController;
