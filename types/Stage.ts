// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Job, { isJob } from "./Job";
import { concat, hasNoOtherKeys, isArrayOf } from "../../ts/modules/lodash";
import Name, { isName } from "./Name";
import BasePipelineModel, { BASE_PIPELINE_KEYS, isBasePipelineModel } from "./BasePipelineModel";

export const STAGE_STEP_KEYS = concat(BASE_PIPELINE_KEYS, [
    'name',
    'jobs'
]);

export interface Stage extends BasePipelineModel {

    readonly name : Name;
    readonly jobs : readonly Job[];

}

export function isStage (value: any): value is Stage {
    return (
        isBasePipelineModel(value)
        && isName(value?.name)
        && isArrayOf(value?.jobs, isJob, 1)
        && hasNoOtherKeys(value, STAGE_STEP_KEYS)
    );
}

export function stringifyStage (value: Stage): string {
    if ( !isStage(value) ) throw new TypeError(`Not Stage: ${value}`);
    return `Stage#${value.name}`;
}

export function parseStage (value: any): Stage | undefined {
    if ( isStage(value) ) return value;
    return undefined;
}

export default Stage;
