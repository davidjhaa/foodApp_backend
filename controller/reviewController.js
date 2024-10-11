const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModel");

module.exports.getAllReviews=async function getAllReviews(req,res){
  try{
    const reviews= await reviewModel.find();
    if(reviews){
      res.json({
        message:"reviews found",
        data:reviews
      })
    }
    else{
      res.json({
        message:"reviews not found"
      })
    }
  }
  catch(err){
    res.json({
      message:err.message
    })
  }
}

module.exports.top3reviews = async function top3reviews(req, res) {
  try {
    const reviews = await reviewModel
      .find()
      .sort({ rating: -1 })
      .limit(3)
      .populate({
        path: 'plan', // populate the 'plan' field
        select: 'name' // only select the 'name' field from the plan
      });

    if (reviews) {
      res.json({
        message: "Top 3 reviews found",
        data: reviews
      });
    } else {
      res.json({
        message: "Reviews not found"
      });
    }
  } catch (err) {
    res.json({
      message: err.message
    });
  }
};

module.exports.getPlanReviews=async function getPlanReviews(req,res){
  try{
    const planid=req.params.id;
    // console.log("plan id",planid);
    let reviews=await reviewModel.find();

    reviews=reviews.filter(review=>review.plan["_id"]==planid);
    // console.log(reviews);
    return res.json({
      message:'reviews retrieved for a particular plan successful',
      data:reviews
    });
  }
  catch(err){
    return res.json({
      message:err.message
  });
  }
}

module.exports.createReview = async function createReview(req, res) {
  try {
    const id = req.params.plan; // Get plan ID from request params
    let plan = await planModel.findById(id); // Find the plan by ID

    // Create the review with the request body
    let review = await reviewModel.create(req.body);

    // Update the ratingsAverage and the total number of reviews (assuming we have a field `ratingsQuantity` for total reviews)
    const totalRatings = plan.ratingsQuantity || 0; // Default to 0 if `ratingsQuantity` is not defined
    const currentRating = plan.ratingsAverage || 0; // Default to 0 if `ratingsAverage` is not defined
    const newRating = req.body.rating;

    // Calculate the new average rating
    plan.ratingsAverage = ((currentRating * totalRatings) + newRating) / (totalRatings + 1);

    // Increment the ratingsQuantity
    plan.ratingsQuantity = totalRatings + 1;

    // Save the updated plan
    await plan.save();

    // Save the review
    await review.save();

    res.json({
      message: "Review created successfully",
      data: review,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.updateReview=async function updateReview(req,res){
  try{
  let planid=req.params.plan;
  let id=req.body.id;
  let dataToBeUpdated=req.body;
  let keys=[];
  for(let key in dataToBeUpdated){
    if(key==id) continue;
    keys.push(key);
  }
  let review=await reviewModel.findById(id);
  for(let i=0;i<keys.length;i++){
    review[keys[i]]=dataToBeUpdated[keys[i]];
  }
  await review.save();
  return res.json({
    message:'plan updated succesfully',
    data:review
});
  }
  catch(err){
    return res.json({
      message:err.message
  });
  }
}

module.exports.deleteReview=async function deleteReview(req,res){
  try{
  let id=req.body.id;
  //update average ratings 
  console.log("reviewId",id);
  let review=await reviewModel.findByIdAndDelete(id);
  res.json({
    message: "review deleted",
    data: review,
  });
} 
catch (err) {
  return res.json({
    message: err.message,
  });
}
  
  //average rating change update

}