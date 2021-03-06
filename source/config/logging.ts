const getTimeStamp = (): string => {
    return new Date().toISOString();
};

const info = (namespace: string, message: string, object?: any) => {
    object
        ? console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object)
        : console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
};

const warn = (namespace: string, message: string, object?: any) => {
    object
        ? console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object)
        : console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
};

const error = (namespace: string, message: string, object?: any) => {
    object
        ? console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object)
        : console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
};

const debug = (namespace: string, message: string, object?: any) => {
    object
        ? console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object)
        : console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
};

export default {
    info,
    warn,
    error,
    debug
};
