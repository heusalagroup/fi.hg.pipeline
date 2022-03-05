// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys, isArrayOf,
    isRegularObject
} from "../../core/modules/lodash";
import PipelineDTO, { isPipelineDTO } from "./PipelineDTO";

export interface PipelineListDTO {

    readonly list  : PipelineDTO[];

}

export function isPipelineListDTO (value: any): value is PipelineListDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'list'
        ])
        && isArrayOf<PipelineDTO>(value?.list, isPipelineDTO)
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
