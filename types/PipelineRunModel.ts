// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isArrayOf,
    isRegularObject,
    isString, isUndefined
} from "../../ts/modules/lodash";
import PipelineModel, { isPipelineModel } from "./PipelineModel";
import PipelineRunType, { isPipelineRunType } from "./PipelineRunType";
import { isJsonObject, JsonObject } from "../../ts/Json";

export interface PipelineRunModel {

    /**
     * The pipeline to run
     */
    readonly pipelineId       : string;

    /**
     * The type of the pipeline run
     */
    readonly type : PipelineRunType;

    /**
     * Array of agent pool (room) IDs which should be run this task
     */
    readonly agentPoolIdList  : string[];

    /** Optional. The precompiled pipeline model without the parameters property. */
    readonly model   ?: PipelineModel;

    /**
     * Optional variables.
     */
    readonly variables ?: JsonObject;

}

export function isPipelineRunModel (value: any): value is PipelineRunModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'pipelineId',
            'type',
            'agentPoolIdList',
            'pipelineModel',
            'variables'
        ])
        && isPipelineRunType(value?.type)
        && isString(value?.pipelineId)
        && isArrayOf<string>(value?.agentPoolIdList, isString)
        && ( isUndefined(value?.pipelineModel) || isPipelineModel(value?.pipelineModel) )
        && ( isUndefined(value?.variables) || isJsonObject(value?.variables) )
    );
}

export function stringifyPipelineRunModel (value: PipelineRunModel): string {
    return `PipelineRunModel(${value})`;
}

export function parsePipelineRunModel (value: any): PipelineRunModel | undefined {
    if ( isPipelineRunModel(value) ) return value;
    return undefined;
}

export default PipelineRunModel;
