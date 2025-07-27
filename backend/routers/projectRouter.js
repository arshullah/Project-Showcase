const express = require('express');
const Model = require('../models/projectModel');

const router = express.Router();

//add router
router.post('/add',(req,res)=>{
    new Model(req.body).save()
    .then((result) => {
        res.status(200).json(result);
        console.log("add project successfull");
    }).catch((err) => {
        res.status(500).json(err);
        console.log(err,'project not added');
        
    });
    
});

//Delete router
router.delete('/delete/:id',(req,res)=>{
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json(result)
        console.log("user deleted successfully");
    }).catch((err) => {
        res.status(500).json(err);
    });
});

//getall
router.get('/getall',(req,res)=>{
    Model.find({ isApproved: true })
      .populate('contributors')
      .populate('creator', 'name email')
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(500).json(err);
        console.log(err);
      });
});

router.get('/getall-nonapv',(req,res)=>{
    Model.find()
      .populate('contributors')
      .populate('creator', 'name email')
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(500).json(err);
        console.log(err);
      });
});

//getbyid
router.get('/getbyid/:id',(req,res)=>{
    Model.findById(req.params.id)
      .populate('contributors')
      .populate('creator', 'name email')
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(500).json(err);
      });
});
//getbycategory
router.get('/getbycategory/:category', (req, res) => {
    Model.find({ categories: req.params.category })
      .populate('contributors')
      .populate('creator', 'name email')
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(500).json(err);
      });
});
// getbytitle
router.get('/getbytitle/:title',(req,res)=>{
    Model.find({title:req.params.title})
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

// get projects by creator
router.get('/getbycreator/:creatorId', (req, res) => {
    Model.find({ creator: req.params.creatorId })
      .populate('contributors')
      .populate('creator', 'name email')
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(500).json(err);
      });
});

// get projects by contributor
router.get('/getbycontributor/:userId', (req, res) => {
    Model.find({ contributors: req.params.userId })
      .populate('contributors')
      .populate('creator', 'name email')
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(500).json(err);
      });
});

// Dashboard stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const totalProjects = await Model.countDocuments({ isApproved: true });
    const categories = await Model.distinct('categories', { isApproved: true });
    res.json({
      totalProjects,
      categoriesCount: categories.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
//update
router.put('/update/:id',(req,res)=>{
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

// update
router.put('/updatest/:id',(req,res)=>{
    // Remove isApproved from the request body to prevent users from updating it
    const { isApproved, ...updateData } = req.body;
    
    // First find the project to check if user is authorized
    Model.findById(req.params.id)
      .populate('creator', 'name email')
    .then((project) => {
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Check if the user is the creator (you might want to add user authentication middleware)
        // For now, we'll rely on frontend validation, but you can add user ID check here
        // if (project.creator._id.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Not authorized to update this project' });
        // }
        
        // Update the project
        return Model.findByIdAndUpdate(req.params.id, updateData, { new: true })
          .populate('contributors')
          .populate('creator', 'name email');
    })
    .then((result) => {
        if (result) {
            res.status(200).json(result);
        }
    }).catch((err) => {
        res.status(500).json(err);
        console.log(err);
        
    });
});
module.exports = router;