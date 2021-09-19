// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "../types/ControllerType";
import ControllerState, { isControllerState } from "../types/ControllerState";
import { hasNoOtherKeys, isArrayOf, isRegularObject, isString } from "../../../ts/modules/lodash";
import ControllerStateDTO from "../types/ControllerStateDTO";
import StageControllerStateDTO, { isStageControllerStateDTO } from "../stage/StageControllerStateDTO";

export interface PipelineControllerStateDTO extends ControllerStateDTO {

    readonly type   : ControllerType;
    readonly state  : ControllerState;
    readonly name   : string;
    readonly stages : StageControllerStateDTO[];

}

export function isPipelineControllerStateDTO (value: any): value is PipelineControllerStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state',
            'name',
            'stages'
        ])
        && value?.type === ControllerType.PIPELINE
        && isControllerState(value?.state)
        && isString(value?.name)
        && isArrayOf<StageControllerStateDTO>(value?.stages, isStageControllerStateDTO)
    );
}

export function stringifyPipelineControllerStateDTO (value: PipelineControllerStateDTO): string {
    return `PipelineStateDTO(${value})`;
}

export function parsePipelineControllerStateDTO (value: any): PipelineControllerStateDTO | undefined {
    return isPipelineControllerStateDTO(value) ? value : undefined;
}

export default PipelineControllerStateDTO;
