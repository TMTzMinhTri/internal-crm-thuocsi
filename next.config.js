const withPlugins = require('next-compose-plugins');
const withTM = require("next-transpile-modules")(
    [
        "@thuocsi/nextjs-components"
    ]
);

module.exports = withPlugins([withTM], {
    images: {
        // domains: ['miro.medium.com'],
    },
    basePath: '/crm' // default path /crm
});