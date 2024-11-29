'use strict';

let colors={
    Reset: "\x1b[0m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m"
    };
    
    let infoLog = console.info;
    let logLog = console.log;
    let errorLog = console.error;
    let warnLog = console.warn;
    
    module.exports = console.info= function(args)
    {
        let copyArgs = Array.prototype.slice.call(arguments);
        copyArgs.unshift(colors.Green);
        copyArgs.push(colors.Reset);
        infoLog.apply(null,copyArgs);
    };
    
    module.exports = console.warn= function(args)
    {
        let copyArgs = Array.prototype.slice.call(arguments);
        copyArgs.unshift(colors.Yellow);
        copyArgs.push(colors.Reset);
        warnLog.apply(null,copyArgs);
    };
    module.exports = console.error= function(args)
    {
        let copyArgs = Array.prototype.slice.call(arguments);
        copyArgs.unshift(colors.Red);
        copyArgs.push(colors.Reset);
        errorLog.apply(null,copyArgs);
    };