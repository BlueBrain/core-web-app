// This file fixes the issue of 'msw': ReferenceError: TextEncoder is not defined
// https://stackoverflow.com/questions/77358809/referenceerror-textencoder-is-not-defined-during-test-running-with-jest-and-msw

const Environment = require('jest-environment-jsdom').default;

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
    this.global.Response = Response;
    this.global.Request = Request;
  }
};
