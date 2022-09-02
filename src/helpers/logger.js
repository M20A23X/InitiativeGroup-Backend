export const log = {
    info: (info) => console.log(`${new Date().toISOString()} [INFO]: ${info}`),
    warn: (warn) => console.log(`${new Date().toISOString()} [WARN]: ${warn}`),
    err: (error) => console.log(`${new Date().toISOString()} [ERROR]: ${error}`)
};
