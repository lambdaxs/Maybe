const express = require('express');
const router = express.Router();
const mongo = require('../data/db/mongo');
const redis = require('../data/redis/redis');
const ID = require('mongodb').ObjectId;


router.post('/api/list',async(req,res)=>{
    const{url,comment,offset,limit=20} = req.body;

    const query = {};
    if (url){
        query.url = {$regex:url}
    }
    if (comment){
        query.comment = {$regex:comment}
    }

    const model = new mongo.MongoCall({
        name:'db1',
        dbname:'admin',
        colname:'apis',
    }).Model();

    const total_count = await model.countDocuments(query);
    const list = await model.find(query,{skip:offset,limit,projection:{request:1}}).toArray();
    return res.json({
        code:0,
        data:{
            total_count,
            list,
        }
    })
});

router.post('/api/add',async(req,res)=>{
    const {request={},params=[],cals=[],test={}} = req.body;

    //todo check
    const {url='',comment:request_comment=''} = request;
    const {params:test_params='',response=''} = test;

    const model = new mongo.MongoCall({
        name:'db1',
        dbname:'admin',
        colname:'apis',
    }).Model();

    const data = {
        request,
        params,
        cals,
        test
    };

    return model.insertOne(data).then(rs=>{
        return res.json({code:0,data:rs});
    }).catch(err=>{
        return res.json({code:1,msg:err.message});
    })
});

router.post('/api/detail',async(req,res)=>{
    const {_id} = req.body;

    const model = new mongo.MongoCall({
        name:'db1',
        dbname:'admin',
        colname:'apis',
    }).Model();

    const data = await model.findOne({_id:ID(_id)});
    return res.json({
        code:0,
        data:data
    })
});


router.post('/api/update',async(req,res)=>{
    const {_id='',request={},params=[],cals=[],test={}} = req.body;

    //todo check
    const {url='',comment:request_comment=''} = request;
    const {params:test_params='',response=''} = test;

    const model = new mongo.MongoCall({
        name:'db1',
        dbname:'admin',
        colname:'apis',
    }).Model();

    const data = {
        request,
        params,
        cals,
        test
    };

    return model.updateOne({_id:ID(_id)},{$set:data}).then(rs=>{
        return res.json({code:0,data:rs});
    }).catch(err=>{
        return res.json({code:1,msg:err.message});
    })
});

router.post('/api/del',async(req,res)=>{
    const {_id} = req.body;
    const model = new mongo.MongoCall({
        name:'db1',
        dbname:'admin',
        colname:'apis',
    }).Model();

    return model.deleteOne({_id:ID(_id)}).then(rs=>{
        return res.json({code:0,data:rs})
    }).catch(err=>{
        return res.json({code:1,message:err.message})
    })
});

router.post('/api/build',async(req,res)=>{//生成文档
    return res.json({code:0})
});

router.post('/api/deploy',async(req,res)=>{//生成静态文件,记录git版本

});


module.exports = {
    router
};