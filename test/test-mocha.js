/*!
 * Copyright (c) 2024 Christian Fries. All rights reserved.
 */

// Test setup file for Mocha
// This file is loaded before any tests run

// Register ts-node to handle TypeScript files with ES module interop
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true
  }
});

// Set up any global test configuration here if needed

