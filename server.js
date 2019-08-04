var server = require('browser-sync').create();
const transformerProxy = require('transformer-proxy');
const pkg = require('./package.json');
const fs = require('fs');
const path = require('path');

const skinInfo = () => {
    const id = pkg.name;
    const data = {
        'theme.json': JSON.stringify({
            name: pkg.description,
            author: pkg.author,
            version: pkg.version,
        }),
        img: [],
        json: [],
        layout: [],
        menu: [],
        development: true,
    };
    if (fs.existsSync('./dist/colors.json')) {
        data['colors.json'] = JSON.stringify(require('./dist/colors.json'));
    }
    ['icons.svg', 'images.svg'].forEach(file => {
        if (fs.existsSync(path.resolve(__dirname, 'dist', file))) {
            data.img.push(file);
        }
    });
    ['admin.json', 'reseller.json', 'user.json'].forEach(file => {
        if (fs.existsSync(path.resolve(__dirname, 'dist', 'menu', file))) {
            data.menu.push(file);
        }
    });
    ['standard.css', 'sidebar.css', 'grid.css', 'hybrid.css'].forEach(file => {
        if (fs.existsSync(path.resolve(__dirname, 'dist', 'layout', file))) {
            data.layout.push(file);
        }
    });
    return { id, data };
};

// override tokens
const middleware = transformerProxy((data, req, res) => {
    if (req.url.includes('request=global')) {
        const tokens = JSON.parse(data);
        if (typeof tokens.skin_themes === 'undefined') {
            tokens.skin_themes = {};
        }
        const skin = skinInfo();
        tokens.skin_themes[skin.id] = skin.data;
        return Buffer.from(JSON.stringify(tokens));
    }
    return data;
});

function serve(done) {
    server.init(
        {
            host: 'localhost',
            port: 8080,
            proxy: pkg.devHost,
            serveStatic: [{
                route: `/assets/themes/${pkg.name}`,
                dir: 'dist',
            }],
        },
        function (err, bs) {
            bs.addMiddleware("/CMD_JSON_LANG", middleware, { override: true });
        }
    );
    done();
}

function reload(done) {
    server.reload();
    done();
}

module.exports.serve = serve;
module.exports.reload = reload;