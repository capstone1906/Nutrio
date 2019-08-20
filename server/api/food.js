const router = require('express').Router()
const {FoodItems} = require('../db/postgres/models/index')
module.exports = router

router.get('/', async(req,res,next)=> {
    try{
        const foods = await FoodItems.findAll() 
        res.json(foods)
    }
    catch(err) {
        next(err)
    }
})

router.get('/:name', async(req,res,next)=> {
    try{
        const foods = await FoodItems.findOne({
            where: {
                food_name: req.params.name
            }
        }) 
        res.json(foods)
    }
    catch(err) {
        next(err)
    }
})

