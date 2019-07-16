import configFileTest from '../config/config-test.json';
import configFileProduction from '../config/files/config.json';

let configFile: any;

if (process.env.NODE_ENV === 'test') {
    configFile = configFileTest;
}
if (process.env.NODE_ENV === 'production') {
    configFile = configFileProduction;
}
if (process.env.NODE_ENV === 'development') {
    configFile = configFileProduction;
}

export { configFile };
