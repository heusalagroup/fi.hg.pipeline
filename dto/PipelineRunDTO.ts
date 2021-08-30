// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineModel, { isPipelineModel, parsePipelineModel } from "../types/PipelineModel";
import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined
} from "../../ts/modules/lodash";
import ControllerStateDTO, { isControllerStateDTO } from "../controllers/types/ControllerStateDTO";

export interface PipelineRunDTO {

    /**
     * Which pipeline this run originated from
     */
    readonly pipelineId      : string;

    /**
     * The ID of agent (room), which may contain multiple agents to process the pipeline.
     */
    readonly agentId         : string;

    /**
     * The model which will be executed
     */
    readonly model           : PipelineModel;

    /**
     * This is the actual account which has started to process the run.
     *
     * The Pipeline Runner will update this.
     */
    readonly agentAccountId ?: string;

    /**
     * Current pipeline controller state.
     *
     * The Pipeline Runner will update this.
     */
    readonly state          ?: ControllerStateDTO;

}

export function isPipelineRunDTO (value: any): value is PipelineRunDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'pipelineId',
            'agentId',
            'agentAccountId',
            'model',
            'state'
        ])
        && isString(value?.pipelineId)
        && isString(value?.agentId)
        && isStringOrUndefined(value?.agentAccountId)
        && isPipelineModel(value?.model)
        && ( isUndefined(value?.state) || isControllerStateDTO(value?.state) )
    );
}

export function stringifyPipelineRunDTO (value: PipelineRunDTO): string {
    return `PipelineRunDTO(${value})`;
}

export function parsePipelineRunDTO (value: any): PipelineRunDTO | undefined {

    const pipelineId = value?.pipelineId;
    if (!isString(pipelineId)) return undefined;

    const agentId = value?.agentId;
    if (!isString(agentId)) return undefined;

    const agentAccountId = value?.agentAccountId;
    if (!isStringOrUndefined(agentAccountId)) return undefined;

    const model = parsePipelineModel(value?.model);
    if (model === undefined) return undefined;

    const state = isControllerStateDTO(value?.model) ? value?.model : undefined;

    return {
        pipelineId,
        agentId,
        agentAccountId,
        model,
        state
    };

}

export default PipelineRunDTO;
