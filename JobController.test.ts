// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import JobController, { isJobController } from "./JobController";
import ScriptController from "./ScriptController";

describe('isJobController', () => {

    test('can detect JobControllers', () => {

        expect( isJobController( new JobController("build", [new ScriptController("build_npm", "npm", ["run", "build"])]) ) ).toBe(true);

    });

    test('can detect invalid values', () => {

        expect(isJobController(undefined)).toBe(false);
        expect(isJobController(null)).toBe(false);
        expect(isJobController(false)).toBe(false);
        expect(isJobController(true)).toBe(false);
        expect(isJobController(NaN)).toBe(false);
        expect(isJobController(() => {
        })).toBe(false);
        expect(isJobController(0)).toBe(false);
        expect(isJobController(Symbol())).toBe(false);
        expect(isJobController(1628078651664)).toBe(false);
        expect(isJobController(new Date('2021-08-04T12:04:00.844Z'))).toBe(false);
        expect(isJobController(1)).toBe(false);
        expect(isJobController(12)).toBe(false);
        expect(isJobController(-12)).toBe(false);
        expect(isJobController(123)).toBe(false);
        expect(isJobController(123.99999)).toBe(false);
        expect(isJobController(-123.99999)).toBe(false);
        expect(isJobController("123")).toBe(false);
        expect(isJobController("hello")).toBe(false);
        expect(isJobController("")).toBe(false);
        expect(isJobController([])).toBe(false);
        expect(isJobController([ 123 ])).toBe(false);
        expect(isJobController([ "123" ])).toBe(false);
        expect(isJobController([ "Hello world", "foo" ])).toBe(false);
        expect(isJobController({})).toBe(false);
        expect(isJobController({"foo": "bar"})).toBe(false);
        expect(isJobController({"foo": 1234})).toBe(false);

    });

});

describe('JobController', () => {

    describe('#constructor', () => {

        test('can create objects', () => {
            expect(() => new JobController("build", [new ScriptController("build_npm", "npm", ["run", "build"])])).not.toThrow();
        });

    });

    describe('#toJSON', () => {

        test('can turn class to JSON', () => {

            expect(
                (new JobController(
                    "build",
                    [
                        new ScriptController(
                            "build_npm",
                            "npm",
                            [ "run", "build" ]
                        )
                    ]
                )).toJSON()
            ).toStrictEqual({
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
            });

        });

    });

    describe('#toString', () => {

        test('can turn class to string', () => {
            expect( ( new JobController("build", [new ScriptController("build_npm", "npm", ["run", "build"])]) ).toString() ).toBe('JobController#build');
        });

    });

});
