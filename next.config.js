const withPlugins = require('next-compose-plugins');
const withTM = require("next-transpile-modules")(
    [
        "@thuocsi/nextjs-components",
        "@thuocsi/nextjs-lib"
    ]
);

module.exports = withPlugins([withTM], {
    images: {
        // domains: ['miro.medium.com'],
    },
    assetPrefix: process.env.ENV==='local'?'/':'/crm',
    useFileSystemPublicRoutes: true,
    env: {
        WEB_HOST: process.env.WEB_HOST
    }
});