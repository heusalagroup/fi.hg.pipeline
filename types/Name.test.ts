// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Name, { isName, parseName, stringifyName } from "./Name";

describe('isName', () => {

    test( 'can detect Names', () => {

        expect( isName("build") ).toBe(true);
        expect( isName("build_job") ).toBe(true);
        expect( isName("hello") ).toBe(true);
        expect( isName("123") ).toBe(true);

    });

    test( 'can detect invalid values', () => {

        expect( isName(undefined) ).toBe(false);
        expect( isName(null) ).toBe(false);
        expect( isName(false) ).toBe(false);
        expect( isName(true) ).toBe(false);
        expect( isName(NaN) ).toBe(false);
        expect( isName(() => {}) ).toBe(false);
        expect( isName(0) ).toBe(false);
        expect( isName(Symbol()) ).toBe(false);
        expect( isName(1628078651664) ).toBe(false);
        expect( isName(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
        expect( isName(1) ).toBe(false);
        expect( isName(12) ).toBe(false);
        expect( isName(-12) ).toBe(false);
        expect( isName(123) ).toBe(false);
        expect( isName(123.99999) ).toBe(false);
        expect( isName(-123.99999) ).toBe(false);
        expect( isName("") ).toBe(false);
        expect( isName([]) ).toBe(false);
        expect( isName([123]) ).toBe(false);
        expect( isName(["123"]) ).toBe(false);
        expect( isName(["Hello world", "foo"]) ).toBe(false);
        expect( isName({}) ).toBe(false);
        expect( isName({"foo":"bar"}) ).toBe(false);
        expect( isName({"foo":1234}) ).toBe(false);

    });

});

describe('stringifyName', () => {

    test( 'can stringify values', () => {

        expect( stringifyName("build") ).toBe('build');
        expect( stringifyName("build_job") ).toBe('build_job');
        expect( stringifyName("hello") ).toBe('hello');
        expect( stringifyName("123") ).toBe('123');

    });

    test( 'throws TypeError on incorrect values', () => {

        // @ts-ignore
        expect( () => stringifyName(undefined) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(null) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(false) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(true) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(NaN) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(() => {}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(0) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(Symbol()) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(1628078651664) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(1) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(-12) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(123) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(-123.99999) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName("hello world") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName("") ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName([]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName([123]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(["123"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName(["Hello world", "foo"]) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName({}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName({"foo":"bar"}) ).toThrow(TypeError);
        // @ts-ignore
        expect( () => stringifyName({"foo":1234}) ).toThrow(TypeError);

    });

});

describe('parseName', () => {

    test( 'can parse Names', () => {

        expect( parseName("build") ).toBe('build');
        expect( parseName("build_job") ).toBe('build_job');
        expect( parseName(" build_job") ).toBe('build_job');
        expect( parseName("build_job ") ).toBe('build_job');
        expect( parseName(" build_job  ") ).toBe('build_job');
        expect( parseName("hello") ).toBe('hello');
        expect( parseName("123") ).toBe('123');

    });

    test( 'returns undefined for invalid values', () => {

        expect( parseName(undefined) ).toBeUndefined();
        expect( parseName(null) ).toBeUndefined();
        expect( parseName(false) ).toBeUndefined();
        expect( parseName(true) ).toBeUndefined();
        expect( parseName(NaN) ).toBeUndefined();
        expect( parseName(() => {}) ).toBeUndefined();
        expect( parseName(0) ).toBeUndefined();
        expect( parseName(Symbol()) ).toBeUndefined();
        expect( parseName(1628078651664) ).toBeUndefined();
        expect( parseName(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
        expect( parseName(1) ).toBeUndefined();
        expect( parseName(12) ).toBeUndefined();
        expect( parseName(-12) ).toBeUndefined();
        expect( parseName(123) ).toBeUndefined();
        expect( parseName(123.99999) ).toBeUndefined();
        expect( parseName(-123.99999) ).toBeUndefined();
        expect( parseName("") ).toBeUndefined();
        expect( parseName([]) ).toBeUndefined();
        expect( parseName([123]) ).toBeUndefined();
        expect( parseName(["123"]) ).toBeUndefined();
        expect( parseName(["Hello world", "foo"]) ).toBeUndefined();
        expect( parseName({}) ).toBeUndefined();
        expect( parseName({"foo":"bar"}) ).toBeUndefined();
        expect( parseName({"foo":1234}) ).toBeUndefined();

    });

});

describe('Name', () => {

    describe('.test', () => {

        test( 'can detect Names', () => {

            expect( Name.test("build") ).toBe(true);
            expect( Name.test("build_job") ).toBe(true);
            expect( Name.test("hello") ).toBe(true);
            expect( Name.test("123") ).toBe(true);

        });

        test( 'can detect invalid values', () => {

            expect( Name.test(undefined) ).toBe(false);
            expect( Name.test(null) ).toBe(false);
            expect( Name.test(false) ).toBe(false);
            expect( Name.test(true) ).toBe(false);
            expect( Name.test(NaN) ).toBe(false);
            expect( Name.test(() => {}) ).toBe(false);
            expect( Name.test(0) ).toBe(false);
            expect( Name.test(Symbol()) ).toBe(false);
            expect( Name.test(1628078651664) ).toBe(false);
            expect( Name.test(new Date('2021-08-04T12:04:00.844Z')) ).toBe(false);
            expect( Name.test(1) ).toBe(false);
            expect( Name.test(12) ).toBe(false);
            expect( Name.test(-12) ).toBe(false);
            expect( Name.test(123) ).toBe(false);
            expect( Name.test(123.99999) ).toBe(false);
            expect( Name.test(-123.99999) ).toBe(false);
            expect( Name.test("") ).toBe(false);
            expect( Name.test([]) ).toBe(false);
            expect( Name.test([123]) ).toBe(false);
            expect( Name.test(["123"]) ).toBe(false);
            expect( Name.test(["Hello world", "foo"]) ).toBe(false);
            expect( Name.test({}) ).toBe(false);
            expect( Name.test({"foo":"bar"}) ).toBe(false);
            expect( Name.test({"foo":1234}) ).toBe(false);

        });

    });

    describe('.stringify', () => {

        test( 'can stringify values', () => {

            expect( Name.stringify("build") ).toBe('build');
            expect( Name.stringify("build_job") ).toBe('build_job');
            expect( Name.stringify("hello") ).toBe('hello');
            expect( Name.stringify("123") ).toBe('123');

        });

        test( 'throws TypeError on incorrect values', () => {

            // @ts-ignore
            expect( () => Name.stringify(undefined) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(null) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(false) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(true) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(NaN) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(() => {}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(0) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(Symbol()) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(1628078651664) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(new Date('2021-08-04T12:04:00.844Z')) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(1) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(-12) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(123) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(-123.99999) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify("") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(" hello") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify("hello world") ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify([]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify([123]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(["123"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify(["Hello world", "foo"]) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify({}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify({"foo":"bar"}) ).toThrow(TypeError);
            // @ts-ignore
            expect( () => Name.stringify({"foo":1234}) ).toThrow(TypeError);

        });

    });

    describe('.parse', () => {

        test( 'can parse Names', () => {

            expect( Name.parse("build") ).toBe('build');
            expect( Name.parse("build_job") ).toBe('build_job');
            expect( Name.parse(" build_job  ") ).toBe('build_job');
            expect( Name.parse("hello") ).toBe('hello');
            expect( Name.parse("123") ).toBe('123');

        });

        test( 'returns undefined for invalid values', () => {

            expect( Name.parse(undefined) ).toBeUndefined();
            expect( Name.parse(null) ).toBeUndefined();
            expect( Name.parse(false) ).toBeUndefined();
            expect( Name.parse(true) ).toBeUndefined();
            expect( Name.parse(NaN) ).toBeUndefined();
            expect( Name.parse(() => {}) ).toBeUndefined();
            expect( Name.parse(0) ).toBeUndefined();
            expect( Name.parse(Symbol()) ).toBeUndefined();
            expect( Name.parse(1628078651664) ).toBeUndefined();
            expect( Name.parse(new Date('2021-08-04T12:04:00.844Z')) ).toBeUndefined();
            expect( Name.parse(1) ).toBeUndefined();
            expect( Name.parse(12) ).toBeUndefined();
            expect( Name.parse(-12) ).toBeUndefined();
            expect( Name.parse(123) ).toBeUndefined();
            expect( Name.parse(123.99999) ).toBeUndefined();
            expect( Name.parse(-123.99999) ).toBeUndefined();
            expect( Name.parse("") ).toBeUndefined();
            expect( Name.parse([]) ).toBeUndefined();
            expect( Name.parse([123]) ).toBeUndefined();
            expect( Name.parse(["123"]) ).toBeUndefined();
            expect( Name.parse(["Hello world", "foo"]) ).toBeUndefined();
            expect( Name.parse({}) ).toBeUndefined();
            expect( Name.parse({"foo":"bar"}) ).toBeUndefined();
            expect( Name.parse({"foo":1234}) ).toBeUndefined();

        });

    });

});
