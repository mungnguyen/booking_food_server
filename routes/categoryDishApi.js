const categoryController = require("../controllers/categoryController");
const dishController = require("../controllers/dishController");
const catest = require("../controllers/catest");
passport = require('passport');
const authenticate = require('../middleware/authenticate')

module.exports = function(app){
    //CATEGORIES
        //get category
        app.get('/api/category', categoryController.getCategory);
        //create new category
        app.post('/api/category', authenticate('store'), categoryController.createCategory);
        //update category
        app.put('/api/category/:id', authenticate('store'), categoryController.updateCategory);
        //delete category item
        app.delete('/api/category/:id', categoryController.deleteCategory);
    
    //DISHES
        //get all dishes
        app.get('/api/getAllDish', dishController.getAllDish);
        //get dish with its id
        app.get('/api/getDish/:id', dishController.getDishwithId);
        //get all dishes of a store has id
        app.get('/api/getStoreDish/:id', dishController.getDishofStore);
        //add new dish
        app.post('/api/dish/:id', authenticate('store'), dishController.addNewDish)

    // 
    app.delete('/api/catest/:id', catest.deleteCatest);
}