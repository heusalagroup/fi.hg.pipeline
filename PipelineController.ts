// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import StageController, { isStageController } from "./StageController";
import { isArray, isArrayOf, map } from "../ts/modules/lodash";
import Controller from "./types/Controller";

export enum PipelineControllerEvent {

    PIPELINE_STARTED   = "PipelineController:pipelineStarted",
    PIPELINE_PAUSED    = "PipelineController:pipelinePaused",
    PIPELINE_FINISHED  = "PipelineController:pipelineFinished",

    STAGE_STARTED   = "PipelineController:stageStarted",
    STAGE_PAUSED    = "PipelineController:stagePaused",
    STAGE_FINISHED  = "PipelineController:stageFinished",

    JOB_STARTED   = "PipelineController:jobStarted",
    JOB_PAUSED    = "PipelineController:jobPaused",
    JOB_FINISHED  = "PipelineController:jobFinished",

    STEP_STARTED   = "PipelineController:stepStarted",
    STEP_PAUSED    = "PipelineController:stepPaused",
    STEP_FINISHED  = "PipelineController:stepFinished"

}

export type PipelineControllerDestructor = ObserverDestructor;

export class PipelineController implements Controller {

    private readonly _name     : Name;
    private readonly _stages   : StageController[];
    private readonly _observer : Observer<PipelineControllerEvent>;


    public constructor (
        name   : Name,
        stages : StageController[]
    ) {

        if ( !isName(name) ) throw new TypeError(`Pipeline name invalid: ${name}`);
        if ( !isArrayOf(stages, isStageController, 1) ) throw new TypeError(`Pipeline#${name} must have at least one stage`);

        this._name     = name;
        this._stages   = stages;
        this._observer = new Observer<PipelineControllerEvent>(`PipelineController#${this._name}`);

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


    public static Event = PipelineControllerEvent;

}

export function isPipelineController (value: any): value is PipelineController {
    return value instanceof PipelineController;
}

export default PipelineController;
