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
        domains: ['localhost', 'storage.googleapis.com'],
    },
    env: {
        WEB_HOST: process.env.WEB_HOST
    },
    async rewrites() {
        return [{
                source: '/backend/:path*',
                destination: `${process.env.API_HOST}/:path*`
            },
            {
                source: '/a/:path*',
                destination: `http://localhost/:path*`
            }
        ]
    }
});