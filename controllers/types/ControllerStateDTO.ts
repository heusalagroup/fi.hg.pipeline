// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "./ControllerType";
import ControllerState from "./ControllerState";
import { isRegularObject } from "../../../ts/modules/lodash";

export interface ControllerControllerStateDTO {

    readonly type  : ControllerType;
    readonly state : ControllerState;
    readonly name  : string;

}

export function isControllerStateDTO (value: any): value is ControllerControllerStateDTO {
    return (
        isRegularObject(value)
        // && hasNoOtherKeys(value, [
        //     'type',
        //     'state',
        //     'name'
        // ])
    );
}

export function stringifyControllerStateDTO (value: ControllerControllerStateDTO): string {
    return `ControllerStateDTO(${value})`;
}

export default ControllerControllerStateDTO;
