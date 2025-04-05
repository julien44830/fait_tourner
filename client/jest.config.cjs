module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            { tsconfig: "<rootDir>/tsconfig.jest.json" },
        ],
    },
    testMatch: ["**/*.test.(ts|tsx)"],
};
