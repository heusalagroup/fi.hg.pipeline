// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineModel, { isPipelineModel } from "../types/PipelineModel";
import {
    hasNoOtherKeys,
    isRegularObject
} from "../../ts/modules/lodash";

export interface PipelineListDTO {

    readonly list : PipelineModel[];

}

export function isPipelineListDTO (value: any): value is PipelineListDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'list'
        ])
        && isPipelineModel(value?.list)
    );
}

export function stringifyPipelineListDTO (value: PipelineListDTO): string {
    return `PipelineListDTO(${value})`;
}

export function parsePipelineListDTO (value: any): PipelineListDTO | undefined {
    if (!isPipelineListDTO(value)) return undefined;
    return value;
}

export default PipelineListDTO;
