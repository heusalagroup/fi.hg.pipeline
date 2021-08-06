// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import JobController, {
    isJobController, JobControllerDestructor, JobControllerEvent, JobControllerState
} from "./JobController";
import { every, filter, forEach, isArrayOf, map, some } from "../ts/modules/lodash";
import Controller from "./types/Controller";
import LogService from "../ts/LogService";

const LOG = LogService.createLogger('StageController');

export enum StageControllerEvent {

    STAGE_STARTED   = "StageController:stageStarted",
    STAGE_PAUSED    = "StageController:stagePaused",
    STAGE_RESUMED   = "StageController:stageResumed",
    STAGE_FINISHED  = "StageController:stageFinished",
    STAGE_FAILED    = "StageController:stageFailed",
    STAGE_CANCELLED = "StageController:stageCancelled",
    STAGE_CHANGED   = "StageController:stageChanged"

}

export type StageControllerDestructor = ObserverDestructor;

export enum StageControllerState {
    CONSTRUCTED,
    STARTED,
    PAUSED,
    CANCELLED,
    FINISHED,
    FAILED
}

export class StageController implements Controller {

    private readonly _observer        : Observer<StageControllerEvent>;
    private readonly _name            : Name;
    private readonly _jobs            : JobController[];
    private readonly _changedCallback : (event: string, job : JobController) => void;

    private _state          : StageControllerState;
    private _jobDestructors : JobControllerDestructor[];


    public constructor (
        name: Name,
        jobs: JobController[]
    ) {

        if ( !isName(name) ) throw new TypeError(`Stage name invalid: ${name}`);
        if ( !isArrayOf(jobs, isJobController, 1) ) throw new TypeError(`Stage#${name} must have at least one job`);

        this._state           = StageControllerState.CONSTRUCTED;
        this._name            = name;
        this._jobs            = jobs;
        this._observer        = new Observer<StageControllerEvent>(`StageController#${this._name}`);
        this._changedCallback = this._onChanged.bind(this);
        this._jobDestructors  = map(jobs, (item : JobController) : JobControllerDestructor => item.onChanged(this._changedCallback));

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
        return `StageController#${this._name}`;
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
        switch (this._state) {

            case StageControllerState.CANCELLED:
                return true;

            case StageControllerState.FINISHED:
            case StageControllerState.FAILED:
            case StageControllerState.CONSTRUCTED:
            case StageControllerState.PAUSED:
            case StageControllerState.STARTED:
                return false;

        }
    }

    public isFailed (): boolean {
        switch (this._state) {

            case StageControllerState.FAILED:
                return true;

            case StageControllerState.CANCELLED:
            case StageControllerState.FINISHED:
            case StageControllerState.CONSTRUCTED:
            case StageControllerState.PAUSED:
            case StageControllerState.STARTED:
                return false;

        }
    }

    public isFinished (): boolean {
        switch (this._state) {

            case StageControllerState.FINISHED:
            case StageControllerState.FAILED:
            case StageControllerState.CANCELLED:
                return true;

            case StageControllerState.CONSTRUCTED:
            case StageControllerState.PAUSED:
            case StageControllerState.STARTED:
                return false;

        }
    }

    public isPaused (): boolean {
        switch (this._state) {

            case StageControllerState.PAUSED:
                return true;

            case StageControllerState.FAILED:
            case StageControllerState.CANCELLED:
            case StageControllerState.FINISHED:
            case StageControllerState.CONSTRUCTED:
            case StageControllerState.STARTED:
                return false;

        }
    }

    public isRunning (): boolean {
        switch (this._state) {

            case StageControllerState.STARTED:
                return true;

            case StageControllerState.PAUSED:
            case StageControllerState.FAILED:
            case StageControllerState.CANCELLED:
            case StageControllerState.FINISHED:
            case StageControllerState.CONSTRUCTED:
                return false;

        }
    }

    public isStarted (): boolean {
        switch (this._state) {

            case StageControllerState.PAUSED:
            case StageControllerState.STARTED:
                return true;

            case StageControllerState.FAILED:
            case StageControllerState.CANCELLED:
            case StageControllerState.FINISHED:
            case StageControllerState.CONSTRUCTED:
                return false;

        }
    }

    public isSuccessful (): boolean {
        switch (this._state) {

            case StageControllerState.FINISHED:
                return true;

            case StageControllerState.PAUSED:
            case StageControllerState.STARTED:
            case StageControllerState.FAILED:
            case StageControllerState.CANCELLED:
            case StageControllerState.CONSTRUCTED:
                return false;

        }
    }

    public onCancelled (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_CANCELLED, callback);
    }

    public onChanged (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_CHANGED, callback);
    }

    public onFailed (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_FAILED, callback);
    }

    public onFinished (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_FINISHED, callback);
    }

    public onPaused (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_PAUSED, callback);
    }

    public onResumed (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_RESUMED, callback);
    }

    public onStarted (callback: ObserverCallback<string, [ StageController ]>): ObserverDestructor {
        return this.on(StageControllerEvent.STAGE_STARTED, callback);
    }

    public start (): Controller {

        if (this._state !== StageControllerState.CONSTRUCTED) {
            throw new Error(`Stage#${this._name} was already started`);
        }

        LOG.info(`Starting stage ${this._name}`);

        this._state = StageControllerState.STARTED;

        const failedJobs = filter(this._jobs, (job: JobController) => {
            try {
                job.start();
                return false;
            } catch (err) {
                LOG.error(`Could not start job#${job.getName()}: ${err}`);
                return true;
            }
        });

        if ( failedJobs.length === this._jobs.length ) {

            this._state = StageControllerState.FAILED;

            if (this._observer.hasCallbacks(StageControllerEvent.STAGE_FAILED)) {
                this._observer.triggerEvent(StageControllerEvent.STAGE_FAILED, this);
            }

        } else {

            if (this._observer.hasCallbacks(StageControllerEvent.STAGE_STARTED)) {
                this._observer.triggerEvent(StageControllerEvent.STAGE_STARTED, this);
            }

        }

        if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
            this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
        }

        return this;

    }

    public pause (): Controller {

        if (this._state === StageControllerState.PAUSED) {
            throw new Error(`Stage#${this._name} was already paused`);
        }

        LOG.info(`Pausing stage ${this._name}`);

        this._state = StageControllerState.PAUSED;

        const failedJobs = filter(this._jobs, (job: JobController) => {
            try {
                if (job.isRunning()) {
                    job.pause();
                }
                return false;
            } catch (err) {
                LOG.error(`Could not pause job#${job.getName()} for stage#${this._name}: ${err}`);
                return true;
            }
        });

        if (failedJobs.length === this._jobs.length) {
            throw new TypeError(`Failed to pause jobs for Stage#${this._name}`);
        }

        if (failedJobs.length > 0) {
            LOG.warn(`Warning! Failed to pause some jobs for Stage#${this._name}`);
        }

        if (this._observer.hasCallbacks(StageControllerEvent.STAGE_PAUSED)) {
            this._observer.triggerEvent(StageControllerEvent.STAGE_PAUSED, this);
        }

        if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
            this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
        }

        return this;

    }

    public resume (): Controller {

        if (this._state === StageControllerState.STARTED) {
            throw new Error(`Stage#${this._name} was already started`);
        }

        LOG.info(`Resuming stage ${this._name}`);

        this._state = StageControllerState.STARTED;

        const failedJobs = filter(this._jobs, (job: JobController) => {
            try {
                if (job.isPaused()) {
                    job.resume();
                }
                return false;
            } catch (err) {
                LOG.error(`Could not resume job#${job.getName()} for stage#${this._name}: ${err}`);
                return true;
            }
        });

        if (failedJobs.length === this._jobs.length) {
            throw new TypeError(`Failed to resume all jobs for Stage#${this._name}`);
        }

        if ( failedJobs.length > 0 ) {
            LOG.warn(`Warning! Failed to resume some jobs for Stage#${this._name}`);
        }

        if (this._observer.hasCallbacks(StageControllerEvent.STAGE_RESUMED)) {
            this._observer.triggerEvent(StageControllerEvent.STAGE_RESUMED, this);
        }

        if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
            this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
        }

        return this;

    }

    public stop (): Controller {

        if (this.isFinished()) {
            throw new Error(`Stage#${this._name} was already finished`);
        }

        LOG.info(`Stopping stage ${this._name}`);

        this._state = StageControllerState.CANCELLED;

        const failedJobs = filter(this._jobs, (job: JobController) => {
            try {
                if (job.isStarted()) {

                    if (job.isPaused()) {
                        job.resume();
                    }

                    job.stop();

                }
                return false;
            } catch (err) {
                LOG.error(`Could not stop job#${job.getName()} for stage#${this._name}: ${err}`);
                return true;
            }
        });

        if ( failedJobs.length === this._jobs.length ) {
            throw new TypeError(`Failed to stop jobs for Stage#${this._name}`);
        }

        if ( failedJobs.length > 0 ) {
            LOG.warn(`Warning! Failed to stop some jobs for Stage#${this._name}`);
        }

        // if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CANCELLED)) {
        //     this._observer.triggerEvent(StageControllerEvent.STAGE_CANCELLED, this);
        // }
        //
        // if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
        //     this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
        // }

        return this;

    }


    private _onChanged (event: string, eventJob : JobController) : void {

        const allJobsFinished = every(this._jobs, (job: JobController) : boolean => job.isFinished());

        if ( allJobsFinished ) {

            if ( this._jobDestructors.length !== 0 ) {

                this._jobDestructors = filter(this._jobDestructors, (destructor: JobControllerDestructor, index: number) => {
                    const job = this._jobs[index];
                    try {
                        destructor();
                    } catch (err) {
                        LOG.warn(`Warning! Destructor for job#${job.getName()} event listener had an error: ${err}`);
                    }
                    return false;
                });

            }

            if ( !this.isFinished() ) {

                const hasFailedJobs    = some(this._jobs, (job: JobController) : boolean => job.isFailed());
                const hasCancelledJobs = some(this._jobs, (job: JobController) : boolean => job.isCancelled());

                if ( hasFailedJobs && this._state !== StageControllerState.FAILED ) {

                    this._state = StageControllerState.FAILED;

                    if (this._observer.hasCallbacks(StageControllerEvent.STAGE_FAILED)) {
                        this._observer.triggerEvent(StageControllerEvent.STAGE_FAILED, this);
                    }

                    if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
                        this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
                    }

                } else if ( hasCancelledJobs && this._state !== StageControllerState.CANCELLED ) {

                    this._state = StageControllerState.CANCELLED;

                    if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CANCELLED)) {
                        this._observer.triggerEvent(StageControllerEvent.STAGE_CANCELLED, this);
                    }

                    if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
                        this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
                    }

                } else if (this._state !== StageControllerState.FINISHED) {

                    this._state = StageControllerState.FINISHED;

                    if (this._observer.hasCallbacks(StageControllerEvent.STAGE_FINISHED)) {
                        this._observer.triggerEvent(StageControllerEvent.STAGE_FINISHED, this);
                    }

                    if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
                        this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
                    }

                }

            }

        } else {

            const startedJobs = filter(this._jobs, (job: JobController) : boolean => job.isStarted());

            const allStartedJobsPaused = every(startedJobs, (job: JobController) : boolean => job.isPaused());

            if ( allStartedJobsPaused && this._state !== StageControllerState.PAUSED ) {

                this._state = StageControllerState.PAUSED;

                if (this._observer.hasCallbacks(StageControllerEvent.STAGE_PAUSED)) {
                    this._observer.triggerEvent(StageControllerEvent.STAGE_PAUSED, this);
                }

                if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
                    this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
                }

            } else if ( !allStartedJobsPaused && this._state === StageControllerState.PAUSED ) {

                this._state = StageControllerState.STARTED;

                if (this._observer.hasCallbacks(StageControllerEvent.STAGE_RESUMED)) {
                    this._observer.triggerEvent(StageControllerEvent.STAGE_RESUMED, this);
                }

                if (this._observer.hasCallbacks(StageControllerEvent.STAGE_CHANGED)) {
                    this._observer.triggerEvent(StageControllerEvent.STAGE_CHANGED, this);
                }

            }

        }

    }

}

export function isStageController (value: any): value is StageController {
    return value instanceof StageController;
}

export default StageController;
