// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import StageController, { isStageController, StageControllerDestructor } from "./StageController";
import { isArrayOf, map } from "../ts/modules/lodash";
import Controller from "./types/Controller";
import LogService from "../ts/LogService";

const LOG = LogService.createLogger('PipelineController');

export enum PipelineControllerEvent {

    PIPELINE_STARTED   = "PipelineController:pipelineStarted",
    PIPELINE_PAUSED    = "PipelineController:pipelinePaused",
    PIPELINE_RESUMED   = "PipelineController:pipelineResumed",
    PIPELINE_FINISHED  = "PipelineController:pipelineFinished",
    PIPELINE_CANCELLED = "PipelineController:pipelineCancelled",
    PIPELINE_FAILED    = "PipelineController:pipelineFailed",
    PIPELINE_CHANGED   = "PipelineController:pipelineChanged"

}

export type PipelineControllerDestructor = ObserverDestructor;

export enum PipelineControllerState {
    CONSTRUCTED,
    STARTED,
    PAUSED,
    CANCELLED,
    FINISHED,
    FAILED
}

export class PipelineController implements Controller {

    private readonly _name            : Name;
    private readonly _stages          : StageController[];
    private readonly _observer        : Observer<PipelineControllerEvent>;
    private readonly _changedCallback : (event: string, stage : StageController) => void;

    private _state            : PipelineControllerState;
    private _stageDestructors : StageControllerDestructor[];
    private _current          : number;

    public constructor (
        name   : Name,
        stages : StageController[]
    ) {

        if ( !isName(name) ) throw new TypeError(`Pipeline name invalid: ${name}`);
        if ( !isArrayOf(stages, isStageController, 1) ) throw new TypeError(`Pipeline#${name} must have at least one stage`);

        this._current          = 0;
        this._name             = name;
        this._stages           = stages;
        this._observer         = new Observer<PipelineControllerEvent>(`PipelineController#${this._name}`);
        this._state            = PipelineControllerState.CONSTRUCTED;
        this._changedCallback  = this._onChanged.bind(this);
        this._stageDestructors = map(stages, (item : StageController) : StageControllerDestructor  => item.onChanged(this._changedCallback));

    }

    public getName () : Name {
        return this._name;
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public on (
        name: PipelineControllerEvent,
        callback: ObserverCallback<PipelineControllerEvent>
    ): PipelineControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return `PipelineController#${this._name}`;
    }

    public toJSON (): Json {
        return {
            type   : 'PipelineController',
            name   : this._name,
            stages : map(this._stages, (item: StageController) : Json => item.toJSON())
        };
    }

    public isCancelled (): boolean {
        switch (this._state) {

            case PipelineControllerState.CANCELLED:
                return true;

            case PipelineControllerState.STARTED:
            case PipelineControllerState.PAUSED:
            case PipelineControllerState.CONSTRUCTED:
            case PipelineControllerState.FINISHED:
            case PipelineControllerState.FAILED:
                return false;

        }
    }

    public isFailed (): boolean {
        switch (this._state) {

            case PipelineControllerState.FAILED:
                return true;

            case PipelineControllerState.CANCELLED:
            case PipelineControllerState.STARTED:
            case PipelineControllerState.PAUSED:
            case PipelineControllerState.CONSTRUCTED:
            case PipelineControllerState.FINISHED:
                return false;

        }
    }

    public isFinished (): boolean {
        switch (this._state) {

            case PipelineControllerState.FAILED:
            case PipelineControllerState.CANCELLED:
            case PipelineControllerState.FINISHED:
                return true;

            case PipelineControllerState.STARTED:
            case PipelineControllerState.PAUSED:
            case PipelineControllerState.CONSTRUCTED:
                return false;

        }
    }

    public isPaused (): boolean {
        switch (this._state) {

            case PipelineControllerState.PAUSED:
                return true;

            case PipelineControllerState.FAILED:
            case PipelineControllerState.CANCELLED:
            case PipelineControllerState.FINISHED:
            case PipelineControllerState.STARTED:
            case PipelineControllerState.CONSTRUCTED:
                return false;

        }
    }

    public isRunning (): boolean {
        switch (this._state) {

            case PipelineControllerState.STARTED:
                return true;

            case PipelineControllerState.PAUSED:
            case PipelineControllerState.FAILED:
            case PipelineControllerState.CANCELLED:
            case PipelineControllerState.FINISHED:
            case PipelineControllerState.CONSTRUCTED:
                return false;

        }
    }

    public isStarted (): boolean {
        switch (this._state) {

            case PipelineControllerState.STARTED:
            case PipelineControllerState.PAUSED:
                return true;

            case PipelineControllerState.FAILED:
            case PipelineControllerState.CANCELLED:
            case PipelineControllerState.FINISHED:
            case PipelineControllerState.CONSTRUCTED:
                return false;

        }
    }

    public isSuccessful (): boolean {
        switch (this._state) {

            case PipelineControllerState.FINISHED:
                return true;

            case PipelineControllerState.STARTED:
            case PipelineControllerState.PAUSED:
            case PipelineControllerState.FAILED:
            case PipelineControllerState.CANCELLED:
            case PipelineControllerState.CONSTRUCTED:
                return false;

        }
    }

    public onCancelled (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_CANCELLED, callback);
    }

    public onChanged (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_CHANGED, callback);
    }

    public onFailed (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_FAILED, callback);
    }

    public onFinished (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_FINISHED, callback);
    }

    public onPaused (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_PAUSED, callback);
    }

    public onResumed (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_RESUMED, callback);
    }

    public onStarted (callback: ObserverCallback<string, [ PipelineController ]>): ObserverDestructor {
        return this.on(PipelineControllerEvent.PIPELINE_STARTED, callback);
    }

    public pause (): PipelineController {

        if ( !this.isRunning() ) {
            throw new Error(`Job#${this._name} was not running`);
        }

        LOG.info(`Pausing pipeline ${this._name}`);

        this._state = PipelineControllerState.PAUSED;

        this._stages[this._current].pause();

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_PAUSED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_PAUSED, this);
        }

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
        }

        return this;

    }

    public resume (): PipelineController {

        if ( !this.isPaused() ) {
            throw new Error(`Job#${this._name} was not paused`);
        }

        LOG.info(`Resuming pipeline ${this._name}`);

        this._state = PipelineControllerState.STARTED;

        this._stages[this._current].resume();

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_RESUMED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_RESUMED, this);
        }

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
        }

        return this;

    }

    public start (): PipelineController {

        if (this._state !== PipelineControllerState.CONSTRUCTED) {
            throw new Error(`Job#${this._name} was already started`);
        }

        LOG.info(`Starting pipeline ${this._name}`);

        this._state = PipelineControllerState.STARTED;

        this._stages[this._current].start();

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_STARTED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_STARTED, this);
        }

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
        }

        return this;

    }

    public stop (): PipelineController {

        if ( this._state !== PipelineControllerState.STARTED ) {
            throw new Error(`Job#${this._name} was not started`);
        }

        LOG.info(`Stopping pipeline ${this._name}`);

        this._state = PipelineControllerState.CANCELLED;

        this._stages[this._current].stop();

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CANCELLED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CANCELLED, this);
        }

        if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
            this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
        }

        return this;

    }

    public getErrorString () : string {
        return map(this._stages, stage => stage.getErrorString()).join('\n');
    }

    public getOutputString () : string {
        return map(this._stages, stage => stage.getOutputString()).join('\n');
    }

    public static Event = PipelineControllerEvent;


    private _onChanged (event: string, eventStage : StageController) : void {

        const prevState = this._state;

        const currentStage = this._stages[this._current];

        if ( eventStage !== currentStage ) {
            return;
        }

        if ( currentStage.isFinished() && this.isStarted() ) {

            try {
                const index = this._stages.indexOf(currentStage);
                this._stageDestructors[index]();
            } catch (err) {
                LOG.warn(`Warning! Exception in the step#${currentStage.getName()} listener destructor: `, err);
            }

            if ( currentStage.isFailed() ) {

                this._state = PipelineControllerState.FAILED;

                if ( this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_FAILED) ) {
                    this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_FAILED, this);
                }

                LOG.info(`Pipeline ${this._name} has failed`);

            } else if (currentStage.isCancelled()) {

                this._state = PipelineControllerState.CANCELLED;

                if ( this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CANCELLED) ) {
                    this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CANCELLED, this);
                }

                LOG.info(`Pipeline ${this._name} was cancelled`);

            } else {

                this._current += 1;

                if ( this._current < this._stages.length ) {

                    this._state = PipelineControllerState.STARTED;

                    const nextStage = this._stages[this._current].start();

                    if ( prevState === PipelineControllerState.PAUSED && this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_RESUMED) ) {
                        this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_RESUMED, this);
                    }

                    LOG.info(`Stage ${nextStage.getName()} for pipeline ${this._name} started`);

                } else {

                    this._state = PipelineControllerState.FINISHED;

                    if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_FINISHED)) {
                        this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_FINISHED, this);
                    }

                    LOG.info(`Pipeline ${this._name} finished successfully`);

                }

            }

            if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
                this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
            }

        } else if ( currentStage.isPaused() && !this.isPaused() ) {

            this._state = PipelineControllerState.PAUSED;

            if ( this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_PAUSED) ) {
                this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_PAUSED, this);
            }

            if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
                this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
            }

            LOG.info(`Pipeline ${this._name} was paused`);

        } else if ( currentStage.isStarted() && this.isPaused() ) {

            this._state = PipelineControllerState.STARTED;

            if ( this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_RESUMED) ) {
                this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_RESUMED, this);
            }

            if (this._observer.hasCallbacks(PipelineControllerEvent.PIPELINE_CHANGED)) {
                this._observer.triggerEvent(PipelineControllerEvent.PIPELINE_CHANGED, this);
            }

            LOG.info(`Pipeline ${this._name} was resumed`);

        }

    }

}

export function isPipelineController (value: any): value is PipelineController {
    return value instanceof PipelineController;
}

export default PipelineController;
