module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    overrides: [
        {
            files: [
                'build/copyNimbleResources.js'
            ],
            rules: {
                // Okay to use dev dependencies in build scripts
                'import/no-extraneous-dependencies': 'off',

                // Okay to use console.log in build scripts
                'no-console': 'off'
            }
        }
    ]
};