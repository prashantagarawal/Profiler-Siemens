'use strict';

const Mongoose = require('mongoose');
// const queryDao = require('./mongodao');
require('../console.js')
const mongooseSchema = new Mongoose.Schema({}, {strict: false});
let CreatedCollection =0 ;
let DeletedCOllection = 0;

process.on("message", async (msg) => {
    console.log("Initialize Child Process")
    let dbConnected = await dbConnection(msg.databaseURL);
    if(dbConnected){
        multipleInsertMany(msg.Coll, msg.jsonFirstHalf);
    }
    else {
        console.log('MongoDB not connected');
        process.exit();
    }
});

function dbConnection(uri) {
    return new Promise(async (resolve, reject)=>{
        try {
            Mongoose.set('useCreateIndex', true);
            // Mongoose.set('debug', true);
            Mongoose.connect(uri, {useNewUrlParser: true}, function (err) {
                if (err) {
                    console.log('✗ error while connecting to db: ' + err);
                    //throw err;
                    return reject(err);    
                }
            });
            // When the connection is connected
            Mongoose.connection.on('connected', function () {
                console.log('Mongo Database connected');
                return resolve(true);
            });
            // When the connection is disconnected
            Mongoose.connection.on('disconnected', function () {
                console.log('✗ Mongo Database disconnected');
                return resolve(false);
            });
            // If the node process ends, close the mongoose connection
            process.on('SIGINT', function () {
                Mongoose.connection.close(function () {
                    console.log('✗ Mongo Database disconnected through app termination');
                    process.exit(0);
                    return resolve(false);
                });
            });
        } catch (e) {
            return reject(e);
        }
    });
};

function multipleInsertMany(model,docs){
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.models[model]?Mongoose.model(model) : Mongoose.model(model,mongooseSchema);
                if(docs && docs.length){
                    let options = {
                        'ordered ':true,
                        'rawResult ':true
                    };
                    let result  = await ModelName.collection.insertMany(docs,options);
                    process.send({
                        statusCode: 200,
                        result: result,
                        message: 'Collection '+model+' created successfully.',
                        "documentsInserted": docs.length
                    });
                    // process.exit();
                    
                }else{
                    process.send({
                        statusCode: 400,
                        result: {},
                        message:'No documents to insert',
                        "documentsInserted": docs.length
                    });
                    // process.exit();
                }
        } catch (error) {
            console.log("error", error);
            process.send({
                statusCode: 400,
                result: {},
                message: error,
                "documentsInserted": 0
            });
            // process.exit();
        }
    });
};