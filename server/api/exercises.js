const router = require('express').Router()
const {Exercises} = require('../db/postgres/models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = router

router.get('/:name', async(req,res,next)=> {
    try{
        const exercises = await Exercises.findAll({
            where: {
                activity: {
                    [Op.iLike]: `%${req.params.name}%`
                }
            }
        }) 

        res.json(exercises)
    }
    catch(err) {
        next(err)
    }
})



