// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReadonlyJsonAny } from "../../../../ts/Json";
import Name from "../../../types/Name";
import { isStringOrUndefined } from "../../../../ts/modules/lodash";
import LogService from "../../../../ts/LogService";
import ControllerType from "../../types/ControllerType";
import PipelineContext from "../../../PipelineContext";
import StringUtils from "../../../../ts/StringUtils";
import { isFileControllerAction, FileControllerAction } from "./FileControllerAction";
import BaseStepController from "../types/BaseStepController";
import FileStep, { isFileStep, parseFileStep } from "./FileStep";
import Controller from "../../types/Controller";

const LOG = LogService.createLogger('FileController');

export class FileController extends BaseStepController {

    public static parseControllerModel (model: any) : FileStep {
        return parseFileStep(model);
    }

    public static isControllerModel (model: any) : model is FileStep {
        return isFileStep(model);
    }

    public static createController (
        context : PipelineContext,
        model   : FileStep
    ) : Controller {
        return new FileController(
            context,
            model.name,
            model.target,
            model.file,
            model.output
        );
    }

    /**
     *
     * @param context The context object, which contains variables, etc.
     * @param name The user defined name of the step
     * @param target This is usually the primary argument for the action.
     * @param action This is usually the value for the property which defines the type of the
     *     step, eg. `"file"` or `"command"`.
     * @param outputVariable The variable name where to save successful results of this step
     */
    public constructor (
        context        : PipelineContext,
        name           : Name,
        target         : ReadonlyJsonAny | undefined,
        action         : ReadonlyJsonAny,
        outputVariable : string | undefined = undefined
    ) {

        super(
            context,
            ControllerType.FILE,
            `FileController#${name}`,
            `file#${name}`,
            name,
            target,
            action,
            outputVariable
        );

    }

    public run (
        action : ReadonlyJsonAny | undefined,
        target : ReadonlyJsonAny | undefined
    ) : ReadonlyJsonAny | undefined {

        const context = this.getContext();

        const system = context.getSystem();

        if (!isFileControllerAction(action)) {
            LOG.debug(`run: action = `, action);
            throw new TypeError(`[file#${this.getName()}] failed to compile the action property: ${StringUtils.toString(action)}`);
        }

        if ( action === FileControllerAction.MKDIR ) {

            if (!isStringOrUndefined(target)) {
                throw new TypeError(`[file#${this.getName()}] failed to compile the target property: ${StringUtils.toString(target)}`);
            }

            if (target === undefined) {
                target = system.createTemporaryFile();
                system.createDirectory(target);
                LOG.info(`Created temporary directory: ${target}`);
            } else {
                system.createDirectory(target);
                LOG.info(`Created directory: ${target}`);
            }

            return target;

        } else {
            LOG.debug(`run: action = `, action);
            throw new TypeError(`Unimplemented action: ${action}`)
        }

    }

}

export function isFileController (value: any) : value is FileController {
    return value instanceof FileController;
}

export default FileController;
