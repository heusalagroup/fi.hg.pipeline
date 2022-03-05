// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "../types/ControllerType";
import ControllerState, { isControllerState } from "../types/ControllerState";
import { hasNoOtherKeys, isArrayOf, isRegularObject, isString } from "../../../core/modules/lodash";
import ControllerStateDTO from "../types/ControllerStateDTO";
import StepControllerStateDTO, { isStepControllerStateDTO } from "../step/types/StepControllerStateDTO";

export interface JobControllerStateDTO extends ControllerStateDTO {

    readonly type  : ControllerType.JOB;
    readonly state : ControllerState;
    readonly name  : string;
    readonly steps : StepControllerStateDTO[];

}

export function isJobControllerStateDTO (value: any): value is JobControllerStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state',
            'name',
            'steps'
        ])
        && value?.type === ControllerType.JOB
        && isControllerState(value?.state)
        && isString(value?.name)
        && isArrayOf<StepControllerStateDTO>(value?.steps, (item) => isStepControllerStateDTO(item))
    );
}

export function stringifyJobControllerStateDTO (value: JobControllerStateDTO): string {
    return `JobStateDTO(${value})`;
}

export function parseJobControllerStateDTO (value: any): JobControllerStateDTO | undefined {
    return isJobControllerStateDTO(value) ? value : undefined;
}

export default JobControllerStateDTO;
