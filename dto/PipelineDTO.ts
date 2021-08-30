// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineModel, { isPipelineModel, parsePipelineModel } from "../types/PipelineModel";
import {
    hasNoOtherKeys,
    isRegularObject, isUndefined
} from "../../ts/modules/lodash";

export interface PipelineDTO {

    readonly model : PipelineModel;

}

export function isPipelineDTO (value: any): value is PipelineDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && isPipelineModel(value?.model)
    );
}

export function isPartialPipelineDTO (value: any): value is Partial<PipelineDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && ( isUndefined(value?.model) || isPipelineModel(value?.model) )
    );
}

export function stringifyPipelineDTO (value: PipelineDTO): string {
    return `PipelineDTO(${value})`;
}

export function parsePipelineDTO (value: any): PipelineDTO | undefined {
    const model = parsePipelineModel(value?.model);
    if (model === undefined) return undefined;
    return {model};
}

export default PipelineDTO;
