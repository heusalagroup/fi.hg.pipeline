// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Name from "../../../types/Name";
import PipelineContext from "../../../PipelineContext";
import {
    SystemArgumentList,
    SystemEnvironment
} from "../../../systems/types/System";
import Controller from "../../types/Controller";
import BaseScriptController from "../script/BaseScriptController";
import GitStep, { isGitStep, parseGitStep } from "./GitStep";
import GitControllerAction from "./GitControllerAction";
import ControllerType from "../../types/ControllerType";

export class GitController extends BaseScriptController {

    public static parseControllerModel (model: any) : GitStep {
        return parseGitStep(model);
    }

    public static isControllerModel (model: any) : model is GitStep {
        return isGitStep(model);
    }

    public static createController (
        context : PipelineContext,
        model   : GitStep
    ) : Controller {

        if ( model.git === GitControllerAction.CLONE ) {

            const target = model.target;
            const url    = model.url;

            return new GitController(
                context,
                model.name,
                'git',
                [
                    'clone',
                    url,
                    target
                ],
                {
                    GIT_TERMINAL_PROMPT: "0",
                    GIT_ASKPASS: "/bin/echo"
                }
            );

        } else {
            throw new TypeError(`Unknown git action: ${model.git}`);
        }

    }


    public constructor (
        context  : PipelineContext,
        name     : Name,
        command  : string,
        args     : SystemArgumentList = [],
        env      : SystemEnvironment  = {}
    ) {

        super(
            context,
            ControllerType.GIT,
            'GitController',
            'git',
            name,
            command,
            args,
            env
        );

    }

}

export function isGitController (value: any) : value is GitController {
    return value instanceof GitController;
}

export default GitController;
