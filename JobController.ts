// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";

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

    private readonly _observer: Observer<JobControllerEvent>;


    public constructor () {
        this._observer = new Observer<JobControllerEvent>("JobController");
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
        return 'JobController';
    }

    public toJSON (): Json {
        return {
            type: 'JobController'
        };
    }


    public static Event = JobControllerEvent;

}

export function isJobController (value: any): value is JobController {
    return value instanceof JobController;
}

export default JobController;
