// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineModel, { isPipelineModel, parsePipelineModel } from "../types/PipelineModel";
import {
    hasNoOtherKeys,
    isRegularObject, isStringOrUndefined, isUndefined, parseString
} from "../../ts/modules/lodash";

export interface PipelineDTO {

    readonly id    ?: string;
    readonly model  : PipelineModel;

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
            'id',
            'model'
        ])
        && isStringOrUndefined(value?.id)
        && ( isUndefined(value?.model) || isPipelineModel(value?.model) )
    );
}

export function stringifyPipelineDTO (value: PipelineDTO): string {
    return `PipelineDTO(${value})`;
}

export function parsePipelineDTO (value: any): PipelineDTO | undefined {

    const id = parseString(value?.id);

    const model = parsePipelineModel(value?.model);
    if (model === undefined) return undefined;

    return {id, model};

}

export default PipelineDTO;
