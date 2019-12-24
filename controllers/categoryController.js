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
    db.categories.findAndCountAll({limit: limit, offset: offset}).then(function (data) {
        data.page = page ? page : 0;
        data.pageSize = limit;
        res.status(200).json({
            success: true,
            category: data
        })
    })
}
//create category
const createCategory = async function (req, res) {
    console.log("create category");

    try {
        const category = await db.categories.create({
            name: req.body.name,
            status: req.body.status,
            store_id : req.body.store_id
        })

        if (!category) {
            res.status(402).json({
                success: false,
                message: "category is null"
            })
        } else {
            res.json(category)
        }
    } catch (err) {
        console.log("createCategory-createNew", err)
    }
}


//update category
const updateCategory = (req, res) => {
    console.log("update category");
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
    })
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
        include : [{
            model : db.store,
            attributes : ['name'],
            where : {
                id : req.params.id
            }
        }, {
            model : db.dish
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