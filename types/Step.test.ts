import Step, { isStep, parseStep, stringifyStep } from "./Step";
import Script from "./Script";

describe('isStep', () => {

    test( 'can detect Steps', () => {

        expect( isStep({
            name: 'get_date',
            command: 'date'
        }) ).toBe(true);

    });

    test( 'can detect invalid values', () => {

        expect( isStep(undefined) ).toBe(false);
        expect( isStep(null) ).toBe(false);
        expect( isStep(false) ).toBe(false);
        expect( isStep(true) ).toBe(false);
        expect( isStep(NaN) ).toBe(false);
        expect( isStep(() => {}) ).toBe(false);
        expect( isStep(0) ).toBe(false);
        expect( isStep(Symbol()) ).toBe(false);
        expect( isStep(1628078651664) ).toBe(false);
        expect( isStep(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
        expect( isStep(1) ).toBe(false);
        expect( isStep(12) ).toBe(false);
        expect( isStep(-12) ).toBe(false);
        expect( isStep(123) ).toBe(false);
        expect( isStep(123.99999) ).toBe(false);
        expect( isStep(-123.99999) ).toBe(false);
        expect( isStep("123") ).toBe(false);
        expect( isStep("hello") ).toBe(false);
        expect( isStep("") ).toBe(false);
        expect( isStep([]) ).toBe(false);
        expect( isStep([123]) ).toBe(false);
        expect( isStep(["123"]) ).toBe(false);
        expect( isStep(["Hello world", "foo"]) ).toBe(false);
        expect( isStep({}) ).toBe(false);
        expect( isStep({"foo":"bar"}) ).toBe(false);
        expect( isStep({"foo":1234}) ).toBe(false);

    });

});

describe('stringifyStep', () => {

    test( 'can stringify values', () => {

        expect( Step.stringify({
            name: 'get_date',
            command: 'date'
        } as Script) ).toBe('Script#get_date');

    });

    test( 'throws TypeError on incorrect values', () => {

        // @ts-ignore
        expect( () => stringifyStep(undefined) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(null) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(false) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(true) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(NaN) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(() => {}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(0) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(Symbol()) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(1628078651664) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(1) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(-12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(123) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(-123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep("123") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep("hello") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep("") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep([]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep([123]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(["123"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep(["Hello world", "foo"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep({}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep({"foo":"bar"}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyStep({"foo":1234}) ).toThrow(TypeError);

    });

});

describe('parseStep', () => {

    test( 'can parse Steps', () => {

        expect( parseStep({
            name: 'get_date',
            command: 'date'
        }) ).toStrictEqual({
            name: 'get_date',
            command: 'date'
        });

    });

    test( 'returns undefined for invalid values', () => {

        expect( parseStep(undefined) ).toBeUndefined();
        expect( parseStep(null) ).toBeUndefined();
        expect( parseStep(false) ).toBeUndefined();
        expect( parseStep(true) ).toBeUndefined();
        expect( parseStep(NaN) ).toBeUndefined();
        expect( parseStep(() => {}) ).toBeUndefined();
        expect( parseStep(0) ).toBeUndefined();
        expect( parseStep(Symbol()) ).toBeUndefined();
        expect( parseStep(1628078651664) ).toBeUndefined();
        expect( parseStep(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
        expect( parseStep(1) ).toBeUndefined();
        expect( parseStep(12) ).toBeUndefined();
        expect( parseStep(-12) ).toBeUndefined();
        expect( parseStep(123) ).toBeUndefined();
        expect( parseStep(123.99999) ).toBeUndefined();
        expect( parseStep(-123.99999) ).toBeUndefined();
        expect( parseStep("123") ).toBeUndefined();
        expect( parseStep("hello") ).toBeUndefined();
        expect( parseStep("") ).toBeUndefined();
        expect( parseStep([]) ).toBeUndefined();
        expect( parseStep([123]) ).toBeUndefined();
        expect( parseStep(["123"]) ).toBeUndefined();
        expect( parseStep(["Hello world", "foo"]) ).toBeUndefined();
        expect( parseStep({}) ).toBeUndefined();
        expect( parseStep({"foo":"bar"}) ).toBeUndefined();
        expect( parseStep({"foo":1234}) ).toBeUndefined();

    });

});

describe('Step', () => {

    describe('.test', () => {

        test( 'can detect Steps', () => {

            expect( Step.test({
            name: 'get_date',
            command: 'date'
        }) ).toBe(true);

        });

        test( 'can detect invalid values', () => {

            expect( Step.test(undefined) ).toBe(false);
            expect( Step.test(null) ).toBe(false);
            expect( Step.test(false) ).toBe(false);
            expect( Step.test(true) ).toBe(false);
            expect( Step.test(NaN) ).toBe(false);
            expect( Step.test(() => {}) ).toBe(false);
            expect( Step.test(0) ).toBe(false);
            expect( Step.test(Symbol()) ).toBe(false);
            expect( Step.test(1628078651664) ).toBe(false);
            expect( Step.test(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
            expect( Step.test(1) ).toBe(false);
            expect( Step.test(12) ).toBe(false);
            expect( Step.test(-12) ).toBe(false);
            expect( Step.test(123) ).toBe(false);
            expect( Step.test(123.99999) ).toBe(false);
            expect( Step.test(-123.99999) ).toBe(false);
            expect( Step.test("123") ).toBe(false);
            expect( Step.test("hello") ).toBe(false);
            expect( Step.test("") ).toBe(false);
            expect( Step.test([]) ).toBe(false);
            expect( Step.test([123]) ).toBe(false);
            expect( Step.test(["123"]) ).toBe(false);
            expect( Step.test(["Hello world", "foo"]) ).toBe(false);
            expect( Step.test({}) ).toBe(false);
            expect( Step.test({"foo":"bar"}) ).toBe(false);
            expect( Step.test({"foo":1234}) ).toBe(false);

        });

    });

    describe('.stringify', () => {

        test( 'can stringify values', () => {

            expect( Step.stringify({
                name: 'get_date',
                command: 'date'
            } as Script) ).toBe('Script#get_date');

        });

        test( 'throws TypeError on incorrect values', () => {

            // @ts-ignore
            expect( () => Step.stringify(undefined) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(null) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(false) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(true) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(NaN) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(() => {}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(0) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(Symbol()) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(1628078651664) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(1) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(-12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(123) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(-123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify("123") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify("hello") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify("") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify([]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify([123]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(["123"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify(["Hello world", "foo"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify({}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify({"foo":"bar"}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Step.stringify({"foo":1234}) ).toThrow(TypeError);

        });

    });

    describe('.parse', () => {

        test( 'can parse Steps', () => {

            expect( Step.parse({
                name: 'get_date',
                command: 'date'
            }) ).toStrictEqual({
                name: 'get_date',
                command: 'date'
            });

        });

        test( 'returns undefined for invalid values', () => {

            expect( Step.parse(undefined) ).toBeUndefined();
            expect( Step.parse(null) ).toBeUndefined();
            expect( Step.parse(false) ).toBeUndefined();
            expect( Step.parse(true) ).toBeUndefined();
            expect( Step.parse(NaN) ).toBeUndefined();
            expect( Step.parse(() => {}) ).toBeUndefined();
            expect( Step.parse(0) ).toBeUndefined();
            expect( Step.parse(Symbol()) ).toBeUndefined();
            expect( Step.parse(1628078651664) ).toBeUndefined();
            expect( Step.parse(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
            expect( Step.parse(1) ).toBeUndefined();
            expect( Step.parse(12) ).toBeUndefined();
            expect( Step.parse(-12) ).toBeUndefined();
            expect( Step.parse(123) ).toBeUndefined();
            expect( Step.parse(123.99999) ).toBeUndefined();
            expect( Step.parse(-123.99999) ).toBeUndefined();
            expect( Step.parse("123") ).toBeUndefined();
            expect( Step.parse("hello") ).toBeUndefined();
            expect( Step.parse("") ).toBeUndefined();
            expect( Step.parse([]) ).toBeUndefined();
            expect( Step.parse([123]) ).toBeUndefined();
            expect( Step.parse(["123"]) ).toBeUndefined();
            expect( Step.parse(["Hello world", "foo"]) ).toBeUndefined();
            expect( Step.parse({}) ).toBeUndefined();
            expect( Step.parse({"foo":"bar"}) ).toBeUndefined();
            expect( Step.parse({"foo":1234}) ).toBeUndefined();

        });

    });

});
