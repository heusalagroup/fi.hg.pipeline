// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineController, { isPipelineController } from "./PipelineController";
import StageController from "./StageController";
import JobController from "./JobController";
import ScriptController from "./ScriptController";

describe('isPipelineController', () => {

    test('can detect PipelineControllers', () => {

        expect( isPipelineController( new PipelineController("foo", [
            new StageController("build", [
                new JobController("build", [
                    new ScriptController("build_npm", "npm", ["run", "build"])
                ])
            ])
        ]) ) ).toBe(true);

    });

    test('can detect invalid values', () => {

        expect(isPipelineController(undefined)).toBe(false);
        expect(isPipelineController(null)).toBe(false);
        expect(isPipelineController(false)).toBe(false);
        expect(isPipelineController(true)).toBe(false);
        expect(isPipelineController(NaN)).toBe(false);
        expect(isPipelineController(() => {
        })).toBe(false);
        expect(isPipelineController(0)).toBe(false);
        expect(isPipelineController(Symbol())).toBe(false);
        expect(isPipelineController(1628078651664)).toBe(false);
        expect(isPipelineController(new Date('2021-08-04T12:04:00.844Z'))).toBe(false);
        expect(isPipelineController(1)).toBe(false);
        expect(isPipelineController(12)).toBe(false);
        expect(isPipelineController(-12)).toBe(false);
        expect(isPipelineController(123)).toBe(false);
        expect(isPipelineController(123.99999)).toBe(false);
        expect(isPipelineController(-123.99999)).toBe(false);
        expect(isPipelineController("123")).toBe(false);
        expect(isPipelineController("hello")).toBe(false);
        expect(isPipelineController("")).toBe(false);
        expect(isPipelineController([])).toBe(false);
        expect(isPipelineController([ 123 ])).toBe(false);
        expect(isPipelineController([ "123" ])).toBe(false);
        expect(isPipelineController([ "Hello world", "foo" ])).toBe(false);
        expect(isPipelineController({})).toBe(false);
        expect(isPipelineController({"foo": "bar"})).toBe(false);
        expect(isPipelineController({"foo": 1234})).toBe(false);

    });

});

describe('PipelineController', () => {

    describe('#constructor', () => {

        test('can create objects', () => {
            expect(() => new PipelineController("foo", [
            new StageController("build", [
                new JobController("build", [
                    new ScriptController("build_npm", "npm", ["run", "build"])
                ])
            ])
        ])).not.toThrow();
        });

    });

    describe('#toJSON', () => {

        test('can turn class to JSON', () => {

            expect(
                (
                    new PipelineController("foo", [
                        new StageController("build", [
                            new JobController("build", [
                                new ScriptController("build_npm", "npm", ["run", "build"])
                            ])
                        ])
                    ])
                ).toJSON()
            ).toStrictEqual({
                type: 'PipelineController',
                name: 'foo',
                stages: [
                    {
                        type: 'StageController',
                        name: 'build',
                        jobs: [
                            {
                                type: 'JobController',
                                name: 'build',
                                steps: [
                                    {
                                        type: "ScriptController",
                                        name: "build_npm",
                                        args: [ "run", "build" ],
                                        env: {}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

        });

    });

    describe('#toString', () => {

        test('can turn class to string', () => {
            expect((new PipelineController("foo", [
            new StageController("build", [
                new JobController("build", [
                    new ScriptController("build_npm", "npm", ["run", "build"])
                ])
            ])
        ])).toString()).toBe('PipelineController#foo');
        });

    });

});
