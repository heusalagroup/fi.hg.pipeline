// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Stage, { isStage, parseStage, stringifyStage } from "./Stage";
import Script from "./Script";

describe('isStage', () => {

    test( 'can detect Stages', () => {

        expect( isStage({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        }) ).toBe(true);

    });

    test( 'can detect invalid values', () => {

        expect( isStage(undefined) ).toBe(false);
        expect( isStage(null) ).toBe(false);
        expect( isStage(false) ).toBe(false);
        expect( isStage(true) ).toBe(false);
        expect( isStage(NaN) ).toBe(false);
        expect( isStage(() => {}) ).toBe(false);
        expect( isStage(0) ).toBe(false);
        expect( isStage(Symbol()) ).toBe(false);
        expect( isStage(1628078651664) ).toBe(false);
        expect( isStage(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
        expect( isStage(1) ).toBe(false);
        expect( isStage(12) ).toBe(false);
        expect( isStage(-12) ).toBe(false);
        expect( isStage(123) ).toBe(false);
        expect( isStage(123.99999) ).toBe(false);
        expect( isStage(-123.99999) ).toBe(false);
        expect( isStage("123") ).toBe(false);
        expect( isStage("hello") ).toBe(false);
        expect( isStage("") ).toBe(false);
        expect( isStage([]) ).toBe(false);
        expect( isStage([123]) ).toBe(false);
        expect( isStage(["123"]) ).toBe(false);
        expect( isStage(["Hello world", "foo"]) ).toBe(false);
        expect( isStage({}) ).toBe(false);
        expect( isStage({"foo":"bar"}) ).toBe(false);
        expect( isStage({"foo":1234}) ).toBe(false);

    });

});

describe('stringifyStage', () => {

    test( 'can stringify values', () => {

        expect( parseStage({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        }) ).toStrictEqual({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        });

    });

    test( 'throws TypeError on incorrect values', () => {

        // @ts-ignore
        expect( () => stringifyStage(undefined) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(null) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(false) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(true) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(NaN) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(() => {}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(0) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(Symbol()) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(1628078651664) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(1) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(-12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(123) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(-123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage("123") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage("hello") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage("") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage([]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage([123]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(["123"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage(["Hello world", "foo"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage({}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage({"foo":"bar"}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStage({"foo":1234}) ).toThrow(TypeError);

    });

});

describe('parseStage', () => {

    test( 'can parse Stages', () => {

        expect( parseStage({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        }) ).toStrictEqual({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        });

    });

    test( 'returns undefined for invalid values', () => {

        expect( parseStage(undefined) ).toBeUndefined();
        expect( parseStage(null) ).toBeUndefined();
        expect( parseStage(false) ).toBeUndefined();
        expect( parseStage(true) ).toBeUndefined();
        expect( parseStage(NaN) ).toBeUndefined();
        expect( parseStage(() => {}) ).toBeUndefined();
        expect( parseStage(0) ).toBeUndefined();
        expect( parseStage(Symbol()) ).toBeUndefined();
        expect( parseStage(1628078651664) ).toBeUndefined();
        expect( parseStage(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
        expect( parseStage(1) ).toBeUndefined();
        expect( parseStage(12) ).toBeUndefined();
        expect( parseStage(-12) ).toBeUndefined();
        expect( parseStage(123) ).toBeUndefined();
        expect( parseStage(123.99999) ).toBeUndefined();
        expect( parseStage(-123.99999) ).toBeUndefined();
        expect( parseStage("123") ).toBeUndefined();
        expect( parseStage("hello") ).toBeUndefined();
        expect( parseStage("") ).toBeUndefined();
        expect( parseStage([]) ).toBeUndefined();
        expect( parseStage([123]) ).toBeUndefined();
        expect( parseStage(["123"]) ).toBeUndefined();
        expect( parseStage(["Hello world", "foo"]) ).toBeUndefined();
        expect( parseStage({}) ).toBeUndefined();
        expect( parseStage({"foo":"bar"}) ).toBeUndefined();
        expect( parseStage({"foo":1234}) ).toBeUndefined();

    });

});

describe('Stage', () => {

    describe('.test', () => {

        test( 'can detect Stages', () => {

            expect( Stage.test({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [
                        {
                            name: "foo",
                            command: "npm",
                            args: ["run", "build"]
                        } as Script
                    ]
                }
            ]
        }) ).toBe(true);

        });

        test( 'can detect invalid values', () => {

            expect( Stage.test(undefined) ).toBe(false);
            expect( Stage.test(null) ).toBe(false);
            expect( Stage.test(false) ).toBe(false);
            expect( Stage.test(true) ).toBe(false);
            expect( Stage.test(NaN) ).toBe(false);
            expect( Stage.test(() => {}) ).toBe(false);
            expect( Stage.test(0) ).toBe(false);
            expect( Stage.test(Symbol()) ).toBe(false);
            expect( Stage.test(1628078651664) ).toBe(false);
            expect( Stage.test(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
            expect( Stage.test(1) ).toBe(false);
            expect( Stage.test(12) ).toBe(false);
            expect( Stage.test(-12) ).toBe(false);
            expect( Stage.test(123) ).toBe(false);
            expect( Stage.test(123.99999) ).toBe(false);
            expect( Stage.test(-123.99999) ).toBe(false);
            expect( Stage.test("123") ).toBe(false);
            expect( Stage.test("hello") ).toBe(false);
            expect( Stage.test("") ).toBe(false);
            expect( Stage.test([]) ).toBe(false);
            expect( Stage.test([123]) ).toBe(false);
            expect( Stage.test(["123"]) ).toBe(false);
            expect( Stage.test(["Hello world", "foo"]) ).toBe(false);
            expect( Stage.test({}) ).toBe(false);
            expect( Stage.test({"foo":"bar"}) ).toBe(false);
            expect( Stage.test({"foo":1234}) ).toBe(false);

        });

    });

    describe('.stringify', () => {

        test( 'can stringify values', () => {

            expect( Stage.stringify({
                name: "build",
                jobs: [
                    {
                        name: "build_foo", steps: [{
                            name: "foo",
                            command: "npm",
                            args: ["run", "build"]
                        } as Script ]
                    }
                ]
            }) ).toBe('Stage#build');

            expect( Stage.stringify({
                name: "build_stage",
                jobs: [
                    {
                        name: "build_foo", steps: [{
                            name: "foo",
                            command: "npm",
                            args: ["run", "build"]
                        } as Script ]
                    }
                ]
            }) ).toBe('Stage#build_stage');

        });

        test( 'throws TypeError on incorrect values', () => {

            // @ts-ignore
            expect( () => Stage.stringify(undefined) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(null) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(false) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(true) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(NaN) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(() => {}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(0) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(Symbol()) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(1628078651664) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(1) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(-12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(123) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(-123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify("123") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify("hello") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify("") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify([]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify([123]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(["123"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify(["Hello world", "foo"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify({}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify({"foo":"bar"}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Stage.stringify({"foo":1234}) ).toThrow(TypeError);

        });

    });

    describe('.parse', () => {

        test( 'can parse Stages', () => {

            expect( Stage.parse({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        }) ).toStrictEqual({
            name: "build",
            jobs: [
                {
                    name: "build_foo", steps: [{
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script ]
                }
            ]
        });

        });

        test( 'returns undefined for invalid values', () => {

            expect( Stage.parse(undefined) ).toBeUndefined();
            expect( Stage.parse(null) ).toBeUndefined();
            expect( Stage.parse(false) ).toBeUndefined();
            expect( Stage.parse(true) ).toBeUndefined();
            expect( Stage.parse(NaN) ).toBeUndefined();
            expect( Stage.parse(() => {}) ).toBeUndefined();
            expect( Stage.parse(0) ).toBeUndefined();
            expect( Stage.parse(Symbol()) ).toBeUndefined();
            expect( Stage.parse(1628078651664) ).toBeUndefined();
            expect( Stage.parse(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
            expect( Stage.parse(1) ).toBeUndefined();
            expect( Stage.parse(12) ).toBeUndefined();
            expect( Stage.parse(-12) ).toBeUndefined();
            expect( Stage.parse(123) ).toBeUndefined();
            expect( Stage.parse(123.99999) ).toBeUndefined();
            expect( Stage.parse(-123.99999) ).toBeUndefined();
            expect( Stage.parse("123") ).toBeUndefined();
            expect( Stage.parse("hello") ).toBeUndefined();
            expect( Stage.parse("") ).toBeUndefined();
            expect( Stage.parse([]) ).toBeUndefined();
            expect( Stage.parse([123]) ).toBeUndefined();
            expect( Stage.parse(["123"]) ).toBeUndefined();
            expect( Stage.parse(["Hello world", "foo"]) ).toBeUndefined();
            expect( Stage.parse({}) ).toBeUndefined();
            expect( Stage.parse({"foo":"bar"}) ).toBeUndefined();
            expect( Stage.parse({"foo":1234}) ).toBeUndefined();

        });

    });

});
