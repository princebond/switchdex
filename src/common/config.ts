import { Validator } from 'jsonschema';

import { configFile } from '../config';
import { ConfigFile } from '../util/types';

import { configSchema, schemas } from './configSchema';

export class Config {
    private static _instance: Config;
    private readonly _validator: Validator;
    private _config: ConfigFile;
    public static getInstance(): Config {
        if (!Config._instance) {
            Config._instance = new Config();
        }
        return Config._instance;
    }
    public static getConfig(): ConfigFile {
        return this.getInstance()._config;
    }
    public static setConfig(config: ConfigFile): void {
        if (!Config._instance) {
            Config._instance = new Config();
        }
        Config._instance._setConfig(config);
    }

    constructor() {
        this._validator = new Validator();
        for (const schema of schemas) {
            this._validator.addSchema(schema, schema.id);
        }
        this._validator.validate(configFile, configSchema, { throwError: true });
        this._config = configFile;
    }

    public _setConfig(config: ConfigFile): void {
        this._validator.validate(configFile, configSchema, { throwError: true });
        this._config = config;
    }
}
