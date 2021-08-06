// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import FS from "fs/promises";
import Json from "../ts/Json";
import Pipeline, { isPipeline, parsePipeline } from "./types/Pipeline";
import Stage, { isStage, parseStage } from "./types/Stage";
import Step, { parseStep } from "./types/Step";
import Job, { isJob, parseJob } from "./types/Job";
import LogService from "../ts/LogService";
import PipelineController from "./PipelineController";
import { map } from "../ts/modules/lodash";
import StageController from "./StageController";
import JobController from "./JobController";
import StepController from "./types/StepController";
import { isScript } from "./types/Script";
import ScriptController from "./ScriptController";
import Controller from "./types/Controller";
import { ObserverDestructor } from "../ts/Observer";

const LOG = LogService.createLogger('Runner');

export class Runner {

    public static usage (scriptName: string) : number {
        console.log(`USAGE: ${scriptName} PIPELINE_FILE|STAGE_FILE|JOB_FILE|STEP_FILE`);
        return 1;
    }

    public static createStepController (step: Step) : StepController {

        if (isScript(step)) {
            return new ScriptController(
                step.name,
                step.command,
                step.args,
                step.env
            );
        }

        throw new TypeError(`Unknown step type: ${step.name}`);

    }

    public static createJobController (job: Job) : JobController {

        return new JobController(
            job.name,
            map(job.steps, (step: Step) : StepController => this.createStepController(step))
        );

    }

    public static createStageController (stage: Stage) : StageController {

        return new StageController(
            stage.name,
            map(stage.jobs, (job : Job) : JobController => this.createJobController(job))
        );

    }

    public static createPipelineController (model: Pipeline) : PipelineController {

        return new PipelineController(
            model.name,
            map(model.stages, (stage : Stage) : StageController => this.createStageController(stage))
        );

    }

    public static async main ( args: string[] = [] ) : Promise<number> {

        try {

            args.shift();
            const scriptName = args.shift();

            if (!scriptName) {
                return this.usage('runner');
            }

            const file = args.shift();

            if (!file) {
                return this.usage(scriptName);
            }

            const dataString = await FS.readFile(file, {encoding: 'utf8'});

            const data : Json = JSON.parse(dataString);

            const model : Pipeline | Stage | Job | Step | undefined = (
                parsePipeline(data)
                ?? parseStage(data)
                ?? parseJob(data)
                ?? parseStep(data)
            );

            if (model === undefined) {
                LOG.warn('')
                return this.usage(scriptName);
            }

            let controller : Controller | undefined;

            if ( isPipeline(model) ) {

                LOG.debug(`Starting pipeline ${model.name}`);
                controller = this.createPipelineController(model);

            } else if ( isStage(model) ) {

                LOG.debug(`Starting stage ${model.name}`);
                controller = this.createStageController(model);

            } else if ( isJob(model) ) {

                LOG.debug(`Starting job ${model.name}`);
                controller = this.createJobController(model);

            } else {

                LOG.debug(`Starting step ${model.name}`);
                controller = this.createStepController(model);

            }

            await this.startAndWaitUntilFinished(controller);

            return 0;

        } catch (err) {
            LOG.error(`Exception: `, err);
            return 2;
        }

    }

    public static async startAndWaitUntilFinished (controller : Controller) : Promise<void> {

        return await new Promise((resolve, reject) => {

            let listener : ObserverDestructor | undefined;

            try {

                listener = controller.onFinished(() => {
                    try {

                        LOG.debug(`Controller ${controller.toString()} finished`);

                        if (listener) {
                            listener();
                            listener = undefined;
                        }

                        resolve();

                    } catch (err) {
                        reject(err);
                    }
                });

                controller.start();

            } catch (err) {
                reject(err);
            } finally {
                if (listener) {
                    listener();
                    listener = undefined;
                }
            }

        });

    }

}

export default Runner;
