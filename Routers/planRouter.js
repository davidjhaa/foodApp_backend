const express = require("express");
const planRouter = express.Router();
const{protectRoute, isAuthorised}=require('../controller/authController');
const{getPlan,getAllPlans,createPlan,updatePlan,deletePlan,top3Plans}=require('../controller/planController');

planRouter
    .route('/allPlans')
    .get(getAllPlans)

planRouter
    .route('/top3')
    .get(top3Plans)

planRouter
    .route('/plan/:id')
    .get(getPlan);

planRouter.use(protectRoute);
planRouter
    .route('/crudPlan/:id')
    .patch(updatePlan)
    .delete(deletePlan)

// admin nd restaurant owner can only create,update or delte plans 
planRouter.use(isAuthorised(['admin','restaurantowner']));
planRouter
    .route('/create')
    .post(createPlan);

module.exports =  planRouter;