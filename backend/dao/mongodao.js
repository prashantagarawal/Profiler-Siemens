'use strict';
var path    = require("path");
require('dotenv').config({ path: `.env.${process.env.Client}` });
const Mongoose = require('mongoose');
require('../console.js')
let mongooseSchema ;
//const mongooseSchema = new Mongoose.Schema({}, {strict: false});
let CreatedCollection =0 ;
let DeletedCOllection = 0;



//Count Collection function if Mater Algorithm is executed from front end
exports.CountCollection = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let CreatedCollectionVar = CreatedCollection;
            let DeletedCOllectionVar = DeletedCOllection;
            CreatedCollection = 0, DeletedCOllection = 0;
                return resolve({
                    CreatedCollectionVar: CreatedCollectionVar,
                    DeletedCOllectionVar: DeletedCOllectionVar,
                });
        } catch (error) {
            reject(error);
        }
    });
};

exports.dbConnection = ((uri) => {
    return new Promise(async (resolve, reject)=>{
        try {
            Mongoose.set('useCreateIndex', true);
            console.log("uri", uri)
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
                mongooseSchema = new Mongoose.Schema({}, {strict: false});
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
})(process.env.DATABASE_URL);
// })("mongodb://127.0.0.1:27017/profiler2_dev");

exports.findAll = (collection,query,fields) => {
    return new Promise(async (resolve, reject) => {
        try {
            //const ModelName = Mongoose.model(collection, mongooseSchema);
            const ModelName = Mongoose.models[collection]?Mongoose.model(collection) : Mongoose.model(collection,mongooseSchema);
            let result  = await ModelName.find(query).select(fields).lean();
                return resolve({
                    statusCode: 200,
                    result: result,
                    message: 'All documents fetched successfully'
                });
        } catch (error) {
            reject(error);
        }
    });
};

exports.findAllNew = (ModelName,query,fields) => {
    return new Promise(async (resolve, reject) => {
    try {
    //console.log("ModelName",ModelName)
    //const ModelName = Mongoose.model(collection, mongooseSchema);
    let result  = await ModelName.find(query).select(fields).lean();
    return resolve({
    statusCode:200,
    result:result,
    message:'All documents fetched successfully'
                });
            } catch (error) {
    reject(error);
            }
        });
    };

exports.findOne = (model,query,fields) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.models[model]?Mongoose.model(model) : Mongoose.model(model,mongooseSchema);
            //const ModelName = Mongoose.model(model);
            let result  = await ModelName.findOne(query).select(fields).lean();
            return resolve({
                statusCode: 200,
                result: result,
                message: 'document fetched successfully'
            });

        } catch (error) {
            reject(error);
        }
    });
};

exports.findInArray = (collection, docsArray) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const ModelName = Mongoose.model(collection, mongooseSchema);
            const ModelName = Mongoose.models[collection] ? Mongoose.model(collection) : Mongoose.model(collection, mongooseSchema);
            let result = await ModelName.find({ document_id: { "$in": docsArray } });
            // console.log("result", result);

            if (result.length) {
                return resolve({
                    statusCode: 200,
                    result: result,
                    message: 'All documents fetched successfully'
                });

            } else {
                return resolve({
                    statusCode: 400,
                    result: [],
                    message: 'No documents found'
                });
            }

        } catch (error) {
            reject(error);
        }
    });
};

exports.UpdateDocument = (model,condition,payloadToUpadte,isArray,upsert) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.models[model]?Mongoose.model(model) : Mongoose.model(model,mongooseSchema);
            let update = {
                $set: {},
                $push:{},
                $inc:{}
            };
            let options = {
                new: true,
                upsert: upsert,
               // "fields": fields
            };
            if(isArray){
                update.$push = payloadToUpadte
            }else{
                update.$set = payloadToUpadte
            }
            let result  = await ModelName.findOneAndUpdate(condition,update,options);
            return resolve({
                statusCode: 200,
                result: result,
                message: 'document updated successfully'
            });

        } catch (error) {
            reject(error);
        }
    });
};

exports.UpdateManyDocument = (model,condition,payloadToUpadte,isArray,upsert) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.models[model]?Mongoose.model(model) : Mongoose.model(model,mongooseSchema);
            let update = {
                $set: {},
                $push:{},
                $inc:{}
            };
            let options = {
                new: true,
                upsert: upsert,
               // "fields": fields
            };
            if(isArray){
                update.$push = payloadToUpadte
            }else{
                update.$set = payloadToUpadte
            }
            let result  = await ModelName.updateMany(condition,update,options);
            return resolve({
                statusCode: 200,
                result: result,
                message: 'document updated successfully'
            });

        } catch (error) {
            reject(error);
        }
    });
};

exports.multipleInsertMany = (model,docs) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.model(model, mongooseSchema);
            //const ModelName = Mongoose.model(model);
            // let isCollectionEmpty = await ModelName.estimatedDocumentCount();
            // console.log("isCollectionEmpty",isCollectionEmpty)
                if(docs && docs.length){
                    let options = {
                        'ordered ':true,
                        'rawResult ':true
                    };
                    let result  = await ModelName.collection.insertMany(docs,options);
                    if(docs.length<50000){
                        console.info(model + " Collection created successfully \n");
                        CreatedCollection++
                    }
                    return resolve({
                        statusCode: 200,
                        result: result,
                        message: 'Collection '+model+' created successfully.'
                    });
                }else{
                    return resolve({
                        statusCode: 400,
                        result: {},
                        message:'No documents to insert'
                    });
                }
        } catch (error) {
            reject(error);
        }
    });
};

exports.insertMany = (model,docs) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.models[model]?Mongoose.model(model) : Mongoose.model(model,mongooseSchema);
            // const ModelName = Mongoose.model(model, mongooseSchema);
            //const ModelName = Mongoose.model(model);
            let isCollectionEmpty = await ModelName.estimatedDocumentCount();
            if(isCollectionEmpty /*&& isCollectionEmpty.length*/){
                CreatedCollection++
                return resolve({
                    statusCode: 200,
                    result: isCollectionEmpty,
                    message: 'Collection '+model+' fetched successfully.'
                });
            }else{
                if(docs && docs.length){
                    let options = {
                        'ordered ':true,
                        'rawResult ':true
                    };
                    let result  = await ModelName.collection.insertMany(docs,options);
                    console.info(model + " Collection created successfully \n");
                    CreatedCollection++
                    return resolve({
                        statusCode: 200,
                        result: result,
                        message: 'Collection '+model+' created successfully.'
                    });
                }else{
                    return resolve({
                        statusCode: 400,
                        result: {},
                        message:'No documents to insert'
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

exports.saveNewDocument = (collection,doc) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(doc){
                let options = {
                    'ordered ':true,
                    'rawResult ':true
                };
                let result  = await collection.insertMany(docs,options);
                return resolve({
                    statusCode: 200,
                    result: result,
                    message: 'document fetched successfully'
                });
            }else{
                return resolve({
                    statusCode: 400,
                    result: {},
                    message:'No document to insert'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

exports.findCount = (model,query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ModelName = Mongoose.model(model);
            let result  = await ModelName.countDocuments(query);
            return resolve({
                statusCode: 200,
                count: result,
                message: 'documents count fetched successfully'
            });

        } catch (error) {
            reject(error);
        }
    });
};

exports.dropCollection = (fileName) =>{
return new Promise(async (resolve, reject) => {
    try {
          //  const ModelName = Mongoose.model(fileName, mongooseSchema);
         
            var db = Mongoose.connection;
            // db.on('error', console.error);
            // db.once('open', async function () {
                const ModelName = Mongoose.models[fileName]?Mongoose.model(fileName) : Mongoose.model(fileName,mongooseSchema);
                // const ModelName = Mongoose.model(fileName, mongooseSchema);
                let isCollectionEmpty = await ModelName.estimatedDocumentCount();
                if(isCollectionEmpty){
                    let result  = db.dropCollection(fileName, function (err, result) {
                        if (err) {
                            console.log("error in delete collection",err);
                            return resolve({
                                statusCode: 400,
                                result: result,
                                message: 'error in delete collection'
                            });
                        } else {
                            console.log(" " + fileName + " collection deleted successfully \n");
                            DeletedCOllection++
                            return resolve({
                                statusCode: 200,
                                result: result,
                                message: 'collection deleted successes'
                            });
                        }
                    });
                }else{
                    return resolve({
                        statusCode: 400,
                        result: {},
                        message: 'Collection Not found'
                    });
                }
            // })
    
    }catch (error) {
        console.log("error Drop COllection ",error)
        reject(error);
    }
});
};
