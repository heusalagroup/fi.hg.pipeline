// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Stage, { isStage } from "./Stage";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../ts/modules/lodash";
import { isName } from "./Name";
import BasePipelineModel, { isBasePipelineModel } from "./BasePipelineModel";


export interface Pipeline extends BasePipelineModel {

    readonly name   : string;
    readonly stages : readonly Stage[];

}


export function isPipeline (value: any): value is Pipeline {
    return (
        isBasePipelineModel(value)
        && isName(value?.name)
        && isArrayOf(value?.stages, isStage, 1)
        && hasNoOtherKeys(value, ['name', 'stages'])
    );
}

export function stringifyPipeline (value: Pipeline): string {

    if ( !isPipeline(value) ) throw new TypeError(`Not Pipeline: ${value}`);

    return `Pipeline#${value.name}`;

}

export function parsePipeline (value: any): Pipeline | undefined {
    if ( isPipeline(value) ) return value;
    return undefined;
}

export default Pipeline;
