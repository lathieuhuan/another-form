require('@testing-library/jest-dom');

// https://github.com/ant-design/ant-design/issues/21096
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
