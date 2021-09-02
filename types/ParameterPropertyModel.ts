// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import StringParameterPropertyModel, {
    isStringParameterPropertyModel,
    parseStringParameterPropertyModel
} from "./StringParameterPropertyModel";

export type ParameterPropertyModel = StringParameterPropertyModel;

export function isParameterPropertyModel (value: any): value is ParameterPropertyModel {
    return isStringParameterPropertyModel(value);
}

export function stringifyParameterPropertyModel (value: ParameterPropertyModel): string {
    return `ParameterPropertyModel(${value})`;
}

export function parseParameterPropertyModel (value: any): ParameterPropertyModel | undefined {
    return parseStringParameterPropertyModel(value) ?? undefined;
}

export default ParameterPropertyModel;
