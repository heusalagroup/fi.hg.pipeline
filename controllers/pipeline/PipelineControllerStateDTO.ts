// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "../types/ControllerType";
import ControllerState from "../types/ControllerState";
import { hasNoOtherKeys, isRegularObject } from "../../../ts/modules/lodash";
import ControllerStateDTO from "../types/ControllerStateDTO";
import StageControllerStateDTO from "../stage/StageControllerStateDTO";

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
            'name'
        ])
    );
}

export function stringifyPipelineControllerStateDTO (value: PipelineControllerStateDTO): string {
    return `PipelineStateDTO(${value})`;
}

export function parsePipelineControllerStateDTO (value: any): PipelineControllerStateDTO | undefined {
    return isPipelineControllerStateDTO(value) ? value : undefined;
}

export default PipelineControllerStateDTO;
