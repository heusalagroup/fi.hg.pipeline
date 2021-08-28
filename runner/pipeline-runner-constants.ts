import { parseBoolean, parseString } from "../../ts/modules/lodash";

export const ENABLE_MATRIX : boolean = parseBoolean(process?.env?.ENABLE_MATRIX) ?? true;

export const PIPELINE_AUTHENTICATION : string = parseString(process?.env?.PIPELINE_AUTHENTICATION) ?? '';
