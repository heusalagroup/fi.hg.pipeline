// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import JobController, { isJobController } from "./JobController";
import { isArrayOf, map } from "../ts/modules/lodash";
import Controller from "./types/Controller";

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

export class StageController implements Controller {

    private readonly _observer : Observer<StageControllerEvent>;
    private readonly _name     : Name;
    private readonly _jobs     : JobController[];


    public constructor (
        name: Name,
        jobs: JobController[]
    ) {

        if ( !isName(name) ) throw new TypeError(`Stage name invalid: ${name}`);
        if ( !isArrayOf(jobs, isJobController, 1) ) throw new TypeError(`Stage#${name} must have at least one job`);

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

    public isCancelled (): boolean {
        return false;
    }

    public isFailed (): boolean {
        return false;
    }

    public isFinished (): boolean {
        return false;
    }

    public isPaused (): boolean {
        return false;
    }

    public isRunning (): boolean {
        return false;
    }

    public isStarted (): boolean {
        return false;
    }

    public isSuccessful (): boolean {
        return false;
    }

    public onCancelled (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public onChanged (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public onFailed (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public onFinished (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public onPaused (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public onResumed (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public onStarted (callback: ObserverCallback<string, [ Controller ]>): ObserverDestructor {
        throw new Error('Not implenented')
    }

    public pause (): Controller {
        throw new Error('Not implenented')
    }

    public resume (): Controller {
        throw new Error('Not implenented')
    }

    public start (): Controller {
        throw new Error('Not implenented')
    }

    public stop (): Controller {
        throw new Error('Not implenented')
    }

}

export function isStageController (value: any): value is StageController {
    return value instanceof StageController;
}

export default StageController;
