// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import VariablesModel from "./types/VariablesModel";
import PipelineParametersModel from "./types/PipelineParametersModel";
import Json, { JsonObject, parseJson, ReadonlyJsonAny } from "../ts/Json";
import JsonAny from "../ts/Json";
import { get, set } from "../ts/modules/lodash";
import StringUtils, { VariableResolverCallback } from "../ts/StringUtils";

export class PipelineContext {

    private readonly _variables      : VariablesModel          | undefined;
    private readonly _parameters     : PipelineParametersModel | undefined;
    private readonly _variablePrefix : string;
    private readonly _variableSuffix : string;
    private readonly _lookupVariable : VariableResolverCallback;

    public constructor (
        parameters     : PipelineParametersModel | undefined = undefined,
        variables      : VariablesModel | undefined = undefined,
        variablePrefix : string = '${',
        variableSuffix : string = '}'
    ) {

        this._variables  = variables;
        this._parameters = parameters;

        this._variablePrefix = variablePrefix;
        this._variableSuffix = variableSuffix;

        this._lookupVariable = this.getVariable.bind(this);

    }

    public compileModel<T extends ReadonlyJsonAny> (
        model : T
    ) : ReadonlyJsonAny | undefined {
        return StringUtils.processVariables(
            model,
            this._lookupVariable,
            this._variablePrefix,
            this._variableSuffix
        );
    }

    public getParametersModel () : PipelineParametersModel {
        return this._parameters ?? {};
    }

    public getVariablesModel () : VariablesModel {
        return this._variables ?? {};
    }

    public getVariable (path: string) : ReadonlyJsonAny | undefined {
        return get(this._variables, path);
    }

    public setVariable (
        path  : string,
        value : JsonAny | ReadonlyJsonAny
    ) : PipelineContext {
        set(this._variables as object, path, value);
        return this;
    }

    public toString (): string {
        return 'PipelineContext';
    }

    public toJSON (): Json {
        return {
            type: 'fi.nor.pipeline.context',
            variables: parseJson(JSON.stringify(this._variables))
        };
    }

}

export function isPipelineContext (value: any): value is PipelineContext {
    return value instanceof PipelineContext;
}

export default PipelineContext;
