// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum ParameterType {
    JSON    = "json",
    STRING  = "string",
    BOOLEAN = "boolean",
    NUMBER  = "number",
    INTEGER = "integer"
}

export function isParameterType (value: any): value is ParameterType {
    switch (value) {

        case ParameterType.STRING:
            return true;

        default:
            return false;

    }
}

export function stringifyParameterType (value: ParameterType): string {
    switch (value) {

        case ParameterType.STRING: return 'STRING';

    }
    throw new TypeError(`Unsupported ParameterPropertyType value: ${value}`);
}

export function parseParameterType (value: any): ParameterType | undefined {

    switch (`${value}`.toUpperCase()) {

        case 'STRING' : return ParameterType.STRING;

        default    : return undefined;

    }

}

export default ParameterType;
