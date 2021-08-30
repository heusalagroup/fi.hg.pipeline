// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineModel, { isPipelineModel, parsePipelineModel } from "../types/PipelineModel";
import {
    hasNoOtherKeys,
    isRegularObject
} from "../../ts/modules/lodash";
import ControllerStateDTO, { isControllerStateDTO } from "../controllers/types/ControllerStateDTO";

export interface PipelineRunDTO {

    readonly model : PipelineModel;
    readonly state : ControllerStateDTO;

}

export function isPipelineRunDTO (value: any): value is PipelineRunDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && isPipelineModel(value?.model)
    );
}

export function stringifyPipelineRunDTO (value: PipelineRunDTO): string {
    return `PipelineRunDTO(${value})`;
}

export function parsePipelineRunDTO (value: any): PipelineRunDTO | undefined {

    const model = parsePipelineModel(value?.model);
    if (model === undefined) return undefined;

    const state = isControllerStateDTO(value?.model) ? value?.model : undefined;
    if (state === undefined) return undefined;

    return {model, state};
}

export default PipelineRunDTO;
