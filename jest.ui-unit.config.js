module.exports = {
    preset: 'jest-preset-angular',
    setupTestFrameworkScriptFile: '<rootDir>/ui/jest-setup.ts',
    roots: ['<rootDir>/ui'],
    globals: {
        "ts-jest": {
            tsConfigFile: "ui/tsconfig.spec.json"
        },
        __TRANSFORM_HTML__: true
    }
};
