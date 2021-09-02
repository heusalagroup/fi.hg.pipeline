// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum ParameterType {
    STRING = "string"
}

export function isParameterPropertyType (value: any): value is ParameterType {
    switch (value) {

        case ParameterType.STRING:
            return true;

        default:
            return false;

    }
}

export function stringifyParameterPropertyType (value: ParameterType): string {
    switch (value) {

        case ParameterType.STRING: return 'STRING';

    }
    throw new TypeError(`Unsupported ParameterPropertyType value: ${value}`);
}

export function parseParameterPropertyType (value: any): ParameterType | undefined {

    switch (`${value}`.toUpperCase()) {

        case 'STRING' : return ParameterType.STRING;

        default    : return undefined;

    }

}

export default ParameterType;
