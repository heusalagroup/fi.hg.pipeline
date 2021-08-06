// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json, { JsonObject } from "../ts/Json";
import Name, { isName } from "./types/Name";
import StageController, { isStageController } from "./StageController";
import { isArray, map } from "../ts/modules/lodash";

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

export class PipelineController {

    private readonly _name     : Name;
    private readonly _stages   : StageController[];
    private readonly _observer : Observer<PipelineControllerEvent>;


    public constructor (
        name   : Name,
        stages : StageController[]
    ) {

        if ( !isName(name) ) throw new TypeError(`Pipeline name invalid: ${name}`);
        if ( !isArray(stages, isStageController, 1) ) throw new TypeError(`Pipeline#${name} must have at least one stage`);

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


    public static Event = PipelineControllerEvent;

}

export function isPipelineController (value: any): value is PipelineController {
    return value instanceof PipelineController;
}

export default PipelineController;
