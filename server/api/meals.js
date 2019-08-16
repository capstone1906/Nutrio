const router = require('express').Router()
const {Meals} = require('../db/postgres/models/index')
module.exports = router

router.get('/', async(req,res,next)=> {
    try{
        const meals = await Meals.findAll({
            include: [{all:true}]
        })
        res.json(meals)
    }
    catch(err) {
        next(err)
    }
})