const Ajv = require('ajv');
const through = require('through2');
/** TYPES */
const PERCENT = {
    type: 'number',
    minimum: 0,
    maximum: 100,
};

const STRING = { type: 'string' };

const COLOR = {
    type: "object",
    required: ['hue', 'saturation', 'lightness'],
    properties: {
        hue: {
            type: 'number',
            minimum: 0,
            maximum: 360,
        },
        saturation: PERCENT,
        lightness: PERCENT,
    }
};

const ROUTE_ENTRY = {
    type: 'object',
    required: ['name', 'icon', 'route'],
    properties: {
        name: STRING,
        icon: STRING,
        route: STRING,
    },
    additionalProperties: false,
};

const LINK_ENTRY = {
    type: 'object',
    required: ['name', 'icon', 'href'],
    properties: {
        name: STRING,
        icon: STRING,
        href: STRING,
        newTab: { type: 'boolean' },
    },
    additionalProperties: false,
};

const PLUGINS_ENTRY = {
    type: 'object',
    required: ['route'],
    properties: {
        route: {
            const: "plugins",
        },
    },
    additionalProperties: false,
};

const ENTRIES = {
    type: 'array',
    items: {
        oneOf: [ROUTE_ENTRY, LINK_ENTRY, PLUGINS_ENTRY],
    },
    minItems: 1,
};

const colorsSchema = {
    properties: {
        primary: COLOR,
        safe: COLOR,
        danger: COLOR,
        neutral: COLOR,
    },
    additionalProperties: false,
};

const menuSchema = {
    type: 'array',
    items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'icon', 'entries'],
        properties: {
            name: STRING,
            icon: STRING,
            entries: ENTRIES,
        },
    },
};

const ajv = new Ajv();
ajv.addSchema(colorsSchema, 'colors');
ajv.addSchema(menuSchema, 'menu');

function jsonLint(str) {
    try {
        data = JSON.parse(str);
        return data;
    } catch (e) {
        return false;
    }
}

function validate(schemaName, fileContent) {
    const data = jsonLint(fileContent);
    if (data) {
        if (Object.keys(data).length) {
            const valid = ajv.validate(schemaName, data);
            return {
                valid,
                errors: valid
                    ? ''
                    : ajv.errorsText(ajv.errors),
            };
        } else {
            return {
                valid: false,
                errors: `empty file, skipping it...`
            };
        }
    } else {
        return {
            valid: false,
            errors: `invalid json file, skipping it...`,
        };
    }
}

module.exports = (schemaName) => through.obj(
    (file, enc, done) => {
        console.group(`Validating JSON file: \x1b[35m${file.basename}\x1b[0m`);
        const { valid, errors } = validate(schemaName, file.contents.toString());
        if (valid) {
            done(null, file);
        } else {
            console.log(`\x1b[31m${errors}\x1b[0m`);
            done();
        }
        console.groupEnd();
    }
);