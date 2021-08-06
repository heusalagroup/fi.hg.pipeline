// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import StepController, { isStepController } from "./types/StepController";
import { filter, forEach, isArray, map } from "../ts/modules/lodash";
import LogService from "../ts/LogService";
import { ScriptControllerEvent } from "./ScriptController";
import Controller from "./types/Controller";

const LOG = LogService.createLogger('JobController');

export enum JobControllerEvent {

    JOB_CHANGED   = "JobController:jobChanged",
    JOB_STARTED   = "JobController:jobStarted",
    JOB_PAUSED    = "JobController:jobPaused",
    JOB_RESUMED   = "JobController:jobResumed",
    JOB_CANCELLED = "JobController:jobCancelled",
    JOB_FAILED    = "JobController:jobFailed",
    JOB_FINISHED  = "JobController:jobFinished",

}

export type JobControllerDestructor = ObserverDestructor;

export enum JobControllerState {
    CONSTRUCTED,
    STARTED,
    PAUSED,
    CANCELLED,
    FINISHED,
    FAILED
}

export class JobController implements Controller {

    private readonly _observer        : Observer<JobControllerEvent>;
    private readonly _name            : Name;
    private readonly _steps           : StepController[];
    private readonly _changedCallback : (event: string, step : StepController) => void;

    private _state           : JobControllerState;
    private _stepDestructors : ObserverDestructor[];
    private _current         : number;

    public constructor (
        name  : Name,
        steps : StepController[] = []
    ) {

        if ( !isName(name) ) throw new TypeError(`Job name invalid: ${name}`);
        if ( !isArray(steps, isStepController, 1) ) throw new TypeError(`Job#${name} must have at least one step`);

        this._current         = 0;
        this._name            = name;
        this._steps           = steps;
        this._observer        = new Observer<JobControllerEvent>(`JobController#${this._name}`);
        this._state           = JobControllerState.CONSTRUCTED;
        this._changedCallback = this._onChanged.bind(this);
        this._stepDestructors = map(steps, item => item.onChanged(this._changedCallback));

    }

    public getName () : Name {
        return this._name;
    }

    public destroy (): void {

        this._observer.destroy();

        this._stepDestructors = filter(this._stepDestructors, (item : ObserverDestructor, index: number) : boolean => {
            const step = this._steps[index];
            try {
                item();
            } catch (err) {
                LOG.warn(`Warning! Exception in the step#${step.getName()} listener destructor: `, err);
            }
            return false;
        });

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

    public isRunning () : boolean {
        switch (this._state) {

            case JobControllerState.STARTED:
                return true;

            case JobControllerState.PAUSED:
            case JobControllerState.CONSTRUCTED:
            case JobControllerState.CANCELLED:
            case JobControllerState.FINISHED:
            case JobControllerState.FAILED:
                return false;

        }
    }

    public isStarted () : boolean {
        switch (this._state) {

            case JobControllerState.PAUSED:
            case JobControllerState.STARTED:
                return true;

            case JobControllerState.CONSTRUCTED:
            case JobControllerState.CANCELLED:
            case JobControllerState.FINISHED:
            case JobControllerState.FAILED:
                return false;

        }
    }

    public isPaused () : boolean {
        switch (this._state) {

            case JobControllerState.PAUSED:
                return true;

            case JobControllerState.STARTED:
            case JobControllerState.CONSTRUCTED:
            case JobControllerState.CANCELLED:
            case JobControllerState.FINISHED:
            case JobControllerState.FAILED:
                return false;

        }
    }

    public isCancelled () : boolean {
        switch (this._state) {

            case JobControllerState.CANCELLED:
                return true;

            case JobControllerState.PAUSED:
            case JobControllerState.STARTED:
            case JobControllerState.CONSTRUCTED:
            case JobControllerState.FINISHED:
            case JobControllerState.FAILED:
                return false;

        }
    }

    public isFinished () : boolean {
        switch (this._state) {

            case JobControllerState.CONSTRUCTED:
            case JobControllerState.FINISHED:
            case JobControllerState.FAILED:
                return true;

            case JobControllerState.PAUSED:
            case JobControllerState.STARTED:
            case JobControllerState.CANCELLED:
                return false;

        }
    }

    public isFailed () : boolean {
        switch (this._state) {

            case JobControllerState.FAILED:
                return true;

            case JobControllerState.CONSTRUCTED:
            case JobControllerState.FINISHED:
            case JobControllerState.PAUSED:
            case JobControllerState.STARTED:
            case JobControllerState.CANCELLED:
                return false;

        }
    }

    public isSuccessful () : boolean {
        switch (this._state) {

            case JobControllerState.FINISHED:
                return true;

            case JobControllerState.FAILED:
            case JobControllerState.CONSTRUCTED:
            case JobControllerState.PAUSED:
            case JobControllerState.STARTED:
            case JobControllerState.CANCELLED:
                return false;

        }
    }

    public start () : JobController {

        if (this._state !== JobControllerState.CONSTRUCTED) {
            throw new Error(`Job#${this._name} was already started`);
        }

        this._state = JobControllerState.STARTED;

        this._steps[this._current].start();

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_STARTED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_STARTED, this);
        }

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
        }

        return this;

    }

    public pause ()   : JobController {

        if ( !this.isRunning() ) {
            throw new Error(`Job#${this._name} was not running`);
        }

        this._state = JobControllerState.PAUSED;

        this._steps[this._current].pause();

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_PAUSED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_PAUSED, this);
        }

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
        }

        return this;

    }

    public resume ()  : JobController {

        if ( !this.isPaused() ) {
            throw new Error(`Job#${this._name} was not paused`);
        }

        this._state = JobControllerState.STARTED;

        this._steps[this._current].resume();

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_RESUMED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_RESUMED, this);
        }

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
        }

        return this;

    }

    public stop ()    : JobController {

        if ( this._state !== JobControllerState.STARTED ) {
            throw new Error(`Job#${this._name} was not started`);
        }

        this._state = JobControllerState.CANCELLED;

        this._steps[this._current].stop();

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_CANCELLED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_CANCELLED, this);
        }

        if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
            this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
        }

        return this;

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

    public static Event = JobControllerEvent;


    private _onChanged (event: string, eventStep : StepController) : void {

        const prevState = this._state;

        const currentStep = this._steps[this._current];

        if ( eventStep !== currentStep ) {
            return;
        }

        if ( currentStep.isFinished() && this.isStarted() ) {

            try {
                const index = this._steps.indexOf(currentStep);
                this._stepDestructors[index]();
            } catch (err) {
                LOG.warn(`Warning! Exception in the step#${currentStep.getName()} listener destructor: `, err);
            }

            if ( currentStep.isFailed() ) {

                this._state = JobControllerState.FAILED;

                if ( this._observer.hasCallbacks(JobControllerEvent.JOB_FAILED) ) {
                    this._observer.triggerEvent(JobControllerEvent.JOB_FAILED, this);
                }

            } else if (currentStep.isCancelled()) {

                this._state = JobControllerState.CANCELLED;

                if ( this._observer.hasCallbacks(JobControllerEvent.JOB_CANCELLED) ) {
                    this._observer.triggerEvent(JobControllerEvent.JOB_CANCELLED, this);
                }

            } else {

                this._current += 1;

                if ( this._current < this._steps.length ) {

                    this._state = JobControllerState.STARTED;

                    this._steps[this._current].start();

                    if ( prevState === JobControllerState.PAUSED && this._observer.hasCallbacks(JobControllerEvent.JOB_RESUMED) ) {
                        this._observer.triggerEvent(JobControllerEvent.JOB_RESUMED, this);
                    }

                } else {

                    this._state = JobControllerState.FINISHED;

                    if (this._observer.hasCallbacks(JobControllerEvent.JOB_FINISHED)) {
                        this._observer.triggerEvent(JobControllerEvent.JOB_FINISHED, this);
                    }

                }

            }

            if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
                this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
            }

        } else if ( currentStep.isPaused() && !this.isPaused() ) {

            this._state = JobControllerState.PAUSED;

            if ( this._observer.hasCallbacks(JobControllerEvent.JOB_PAUSED) ) {
                this._observer.triggerEvent(JobControllerEvent.JOB_PAUSED, this);
            }

            if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
                this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
            }

        } else if ( currentStep.isStarted() && this.isPaused() ) {

            this._state = JobControllerState.STARTED;

            if ( this._observer.hasCallbacks(JobControllerEvent.JOB_RESUMED) ) {
                this._observer.triggerEvent(JobControllerEvent.JOB_RESUMED, this);
            }

            if (this._observer.hasCallbacks(JobControllerEvent.JOB_CHANGED)) {
                this._observer.triggerEvent(JobControllerEvent.JOB_CHANGED, this);
            }

        }

    }

}

export function isJobController (value: any): value is JobController {
    return value instanceof JobController;
}

export default JobController;
