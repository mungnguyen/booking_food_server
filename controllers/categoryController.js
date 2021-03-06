db = require("../models");
bcrypt = require("bcrypt-nodejs");
Sequelize = require('sequelize')
//get category
const getCategory = (req, res) => {
    console.log("getting category");
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const limit = pageSize ? pageSize : 20;
    const offset = page ? page * limit : 0;
    db.categories.findAndCountAll({
        where: {
            status: 1
        },
        limit: limit, 
        offset: offset}).then(function (data) {
        data.page = page ? page : 0;
        data.pageSize = limit;
        res.status(200).json({
            success: true,
            category: data
        })
    })
}
//create category
const createCategory =  (req, res) => {
    if(req.user.role == "store"){
        db.categories.create({
            name : req.body.name,
            status : 0,
            store_id : req.user.id
        }).then(function(category){
            if(!category){
                res.json({
                    success : false,
                    message : "Them that bai"
                })
            }else{
                res.json({
                    success : true,
                    message : "Them thanh cong",
                    data : category
                })
            }
        })
    }
    else if(req.user.role == "admin"){
        db.categories.create({
            name : req.body.name,
            status : 1,
        }).then(function(category){
            if(!category){
                res.json({
                    success : false,
                    message : "Them that bai"
                })
            }else{
                res.json({
                    success : true,
                    message : "Them thanh cong",
                    data : category
                })
            }
        })
    }
}


//update category
const updateCategory = (req, res) => {
    console.log("update category");
    if(req.user.role == 'admin'){
    db.categories.update({
        name: req.body.name,
        status: req.body.status
    }, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.json({
            success: true,
            message: "Updated category",
            data: result
        })
    })}
    if(req.user.role == 'store'){  
        db.categories.update({
            name: req.body.name
        }, {
            where: {
                id: req.params.id,
                store_id: req.user.id,
                status: 0
            }
        }).then(result => {
            if(result!=0) {
                db.categories.findOne({
                    where: {
                        id: req.params.id
                    }
                }).then(category=>{
                    res.json({
                        success: true,
                        message: "Updated category",
                        data: category
                    })
                })}
            else {
                res.json({
                    success: false,
                    message: "cannot update category"
                })
            }
        })
    }
}

//delete category
const deleteCategory = (req, res) => {
    console.log("deleting category");

    db.categories.destroy({
        where: {
            id: req.params.id
        }
    }).then(function () {
        res.json({
            success: true,
            message: "Da xoa thanh cong",
        })
    })

}


const getCategoryByStoreId = (req, res) => {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const limit = pageSize? pageSize : 20;
    const offset = page? page*limit : 0
    db.categories.findAndCountAll({
        attributes : ['id', 'name', 'status'],
        include : [ {
            model : db.dish,
            where : {
                store_id : req.params.id
            }
        }],
        limit: limit,
        offset: offset,
        distinct: true
    }).then(function(data){
        data.page = page? page : 0
        data.pageSize = limit
        res.json({
            success : true,
            data : data
        })
    }).catch(function(err){
        console.log(err);
    })
}

const category = {};
category.getCategory = getCategory;
category.createCategory = createCategory;
category.updateCategory = updateCategory;
category.deleteCategory = deleteCategory;
category.getCategoryByStoreId = getCategoryByStoreId;

module.exports = category