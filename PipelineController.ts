// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";

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

    private readonly _observer: Observer<PipelineControllerEvent>;


    public constructor () {
        this._observer = new Observer<PipelineControllerEvent>("PipelineController");
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
        return 'PipelineController';
    }

    public toJSON (): Json {
        return {
            type: 'PipelineController'
        };
    }


    public static Event = PipelineControllerEvent;

}

export function isPipelineController (value: any): value is PipelineController {
    return value instanceof PipelineController;
}

export default PipelineController;
