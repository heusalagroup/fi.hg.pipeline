import FS from "fs/promises";
import Json from "../ts/Json";
import PipelineRunner from "./PipelineRunner";
import Controller from "./types/Controller";
import LogService from "../ts/LogService";

const LOG = LogService.createLogger('main');

export function mainUsage (scriptName: string) : number {
    console.log(`USAGE: ${scriptName} PIPELINE_FILE|STAGE_FILE|JOB_FILE|STEP_FILE`);
    return 1;
}

export async function main (args: string[] = []) {

    try {

        args.shift();
        const scriptName = args.shift();

        if (!scriptName) {
            return mainUsage('runner');
        }

        const file = args.shift();

        if (!file) {
            return mainUsage(scriptName);
        }

        const dataString = await FS.readFile(file, {encoding: 'utf8'});

        const data : Json = JSON.parse(dataString);

        const model = PipelineRunner.parseModel(data);

        if ( model === undefined ) {
            LOG.warn('')
            return mainUsage(scriptName);
        }

        let controller : Controller = PipelineRunner.createController(model);

        await PipelineRunner.startAndWaitUntilFinished(controller);

        return 0;

    } catch (err) {
        LOG.error(`Exception: `, err);
        return 2;
    }

}

export default main;
