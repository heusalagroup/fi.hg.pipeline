import Job, { isJob, parseJob, stringifyJob } from "./Job";
import Script from "./Script";

describe('isJob', () => {

    test( 'can detect Jobs', () => {

        expect( isJob({name: "build_foo", steps: [{
            name: "foo",
            command: "npm",
            args: ["run", "build"]
        }]}) ).toBe(true);

    });

    test( 'can detect invalid values', () => {

        expect( isJob(undefined) ).toBe(false);
        expect( isJob(null) ).toBe(false);
        expect( isJob(false) ).toBe(false);
        expect( isJob(true) ).toBe(false);
        expect( isJob(NaN) ).toBe(false);
        expect( isJob(() => {}) ).toBe(false);
        expect( isJob(0) ).toBe(false);
        expect( isJob(Symbol()) ).toBe(false);
        expect( isJob(1628078651664) ).toBe(false);
        expect( isJob(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
        expect( isJob(1) ).toBe(false);
        expect( isJob(12) ).toBe(false);
        expect( isJob(-12) ).toBe(false);
        expect( isJob(123) ).toBe(false);
        expect( isJob(123.99999) ).toBe(false);
        expect( isJob(-123.99999) ).toBe(false);
        expect( isJob("123") ).toBe(false);
        expect( isJob("hello") ).toBe(false);
        expect( isJob("") ).toBe(false);
        expect( isJob([]) ).toBe(false);
        expect( isJob([123]) ).toBe(false);
        expect( isJob(["123"]) ).toBe(false);
        expect( isJob(["Hello world", "foo"]) ).toBe(false);
        expect( isJob({}) ).toBe(false);
        expect( isJob({"foo":"bar"}) ).toBe(false);
        expect( isJob({"foo":1234}) ).toBe(false);

    });

});

describe('stringifyJob', () => {

    test( 'can stringify values', () => {

        expect( stringifyJob({name: "build_foo", steps: [{
            name: "foo",
            command: "npm",
            args: ["run", "build"]
        } as Script ]}) ).toBe('Job#build_foo');

    });

    test( 'throws TypeError on incorrect values', () => {

        // @ts-ignore
        expect( () => stringifyJob(undefined) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(null) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(false) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(true) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(NaN) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(() => {}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(0) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(Symbol()) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(1628078651664) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(1) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(-12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(123) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(-123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob("123") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob("hello") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob("") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob([]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob([123]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(["123"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob(["Hello world", "foo"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob({}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob({"foo":"bar"}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyJob({"foo":1234}) ).toThrow(TypeError);

    });

});

describe('parseJob', () => {

    test( 'can parse Jobs', () => {

        expect( parseJob({name: "build_foo", steps: [{
            name: "foo",
            command: "npm",
            args: ["run", "build"]
        }]}) ).toStrictEqual({name: "build_foo", steps: [{
            name: "foo",
            command: "npm",
            args: ["run", "build"]
        }]});

    });

    test( 'returns undefined for invalid values', () => {

        expect( parseJob(undefined) ).toBeUndefined();
        expect( parseJob(null) ).toBeUndefined();
        expect( parseJob(false) ).toBeUndefined();
        expect( parseJob(true) ).toBeUndefined();
        expect( parseJob(NaN) ).toBeUndefined();
        expect( parseJob(() => {}) ).toBeUndefined();
        expect( parseJob(0) ).toBeUndefined();
        expect( parseJob(Symbol()) ).toBeUndefined();
        expect( parseJob(1628078651664) ).toBeUndefined();
        expect( parseJob(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
        expect( parseJob(1) ).toBeUndefined();
        expect( parseJob(12) ).toBeUndefined();
        expect( parseJob(-12) ).toBeUndefined();
        expect( parseJob(123) ).toBeUndefined();
        expect( parseJob(123.99999) ).toBeUndefined();
        expect( parseJob(-123.99999) ).toBeUndefined();
        expect( parseJob("123") ).toBeUndefined();
        expect( parseJob("hello") ).toBeUndefined();
        expect( parseJob("") ).toBeUndefined();
        expect( parseJob([]) ).toBeUndefined();
        expect( parseJob([123]) ).toBeUndefined();
        expect( parseJob(["123"]) ).toBeUndefined();
        expect( parseJob(["Hello world", "foo"]) ).toBeUndefined();
        expect( parseJob({}) ).toBeUndefined();
        expect( parseJob({"foo":"bar"}) ).toBeUndefined();
        expect( parseJob({"foo":1234}) ).toBeUndefined();

    });

});

describe('Job', () => {

    describe('.test', () => {

        test( 'can detect Jobs', () => {

            expect( Job.test({name: "build_foo", steps: [{
                    name: "foo",
                    command: "npm",
                    args: ["run", "build"]
                }]}) ).toBe(true);

        });

        test( 'can detect invalid values', () => {

            expect( Job.test(undefined) ).toBe(false);
            expect( Job.test(null) ).toBe(false);
            expect( Job.test(false) ).toBe(false);
            expect( Job.test(true) ).toBe(false);
            expect( Job.test(NaN) ).toBe(false);
            expect( Job.test(() => {}) ).toBe(false);
            expect( Job.test(0) ).toBe(false);
            expect( Job.test(Symbol()) ).toBe(false);
            expect( Job.test(1628078651664) ).toBe(false);
            expect( Job.test(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
            expect( Job.test(1) ).toBe(false);
            expect( Job.test(12) ).toBe(false);
            expect( Job.test(-12) ).toBe(false);
            expect( Job.test(123) ).toBe(false);
            expect( Job.test(123.99999) ).toBe(false);
            expect( Job.test(-123.99999) ).toBe(false);
            expect( Job.test("123") ).toBe(false);
            expect( Job.test("hello") ).toBe(false);
            expect( Job.test("") ).toBe(false);
            expect( Job.test([]) ).toBe(false);
            expect( Job.test([123]) ).toBe(false);
            expect( Job.test(["123"]) ).toBe(false);
            expect( Job.test(["Hello world", "foo"]) ).toBe(false);
            expect( Job.test({}) ).toBe(false);
            expect( Job.test({"foo":"bar"}) ).toBe(false);
            expect( Job.test({"foo":1234}) ).toBe(false);

        });

    });

    describe('.stringify', () => {

        test( 'can stringify values', () => {

            expect( Job.stringify({
                name: "build_foo",
                steps: [
                    {
                        name: "foo",
                        command: "npm",
                        args: ["run", "build"]
                    } as Script
                ]
            }) ).toBe('Job#build_foo');

        });

        test( 'throws TypeError on incorrect values', () => {

            // @ts-ignore
            expect( () => Job.stringify(undefined) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(null) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(false) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(true) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(NaN) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(() => {}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(0) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(Symbol()) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(1628078651664) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(1) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(-12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(123) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(-123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify("123") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify("hello") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify("") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify([]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify([123]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(["123"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify(["Hello world", "foo"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify({}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify({"foo":"bar"}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Job.stringify({"foo":1234}) ).toThrow(TypeError);

        });

    });

    describe('.parse', () => {

        test( 'can parse Jobs', () => {

            expect( Job.parse({name: "build_foo", steps: [{
            name: "foo",
            command: "npm",
            args: ["run", "build"]
        }]}) ).toStrictEqual({name: "build_foo", steps: [{
            name: "foo",
            command: "npm",
            args: ["run", "build"]
        }]});

        });

        test( 'returns undefined for invalid values', () => {

            expect( Job.parse(undefined) ).toBeUndefined();
            expect( Job.parse(null) ).toBeUndefined();
            expect( Job.parse(false) ).toBeUndefined();
            expect( Job.parse(true) ).toBeUndefined();
            expect( Job.parse(NaN) ).toBeUndefined();
            expect( Job.parse(() => {}) ).toBeUndefined();
            expect( Job.parse(0) ).toBeUndefined();
            expect( Job.parse(Symbol()) ).toBeUndefined();
            expect( Job.parse(1628078651664) ).toBeUndefined();
            expect( Job.parse(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
            expect( Job.parse(1) ).toBeUndefined();
            expect( Job.parse(12) ).toBeUndefined();
            expect( Job.parse(-12) ).toBeUndefined();
            expect( Job.parse(123) ).toBeUndefined();
            expect( Job.parse(123.99999) ).toBeUndefined();
            expect( Job.parse(-123.99999) ).toBeUndefined();
            expect( Job.parse("123") ).toBeUndefined();
            expect( Job.parse("hello") ).toBeUndefined();
            expect( Job.parse("") ).toBeUndefined();
            expect( Job.parse([]) ).toBeUndefined();
            expect( Job.parse([123]) ).toBeUndefined();
            expect( Job.parse(["123"]) ).toBeUndefined();
            expect( Job.parse(["Hello world", "foo"]) ).toBeUndefined();
            expect( Job.parse({}) ).toBeUndefined();
            expect( Job.parse({"foo":"bar"}) ).toBeUndefined();
            expect( Job.parse({"foo":1234}) ).toBeUndefined();

        });

    });

});
