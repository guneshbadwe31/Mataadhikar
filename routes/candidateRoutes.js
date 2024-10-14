const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Candidate = require('../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const { find } = require('lodash');




const checkAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
    }catch(err){
        return false;
    } 
}





// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) =>{
    try{
        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message: 'user does not have admin role'});

        const data = req.body // Assuming the request body contains the Candidate data

        // Create a new Candidate document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new Candidate to the database
        const response = await newCandidate.save();
        console.log('data saved'); 
        res.status(200).json({response: response});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});





router.put('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData = req.body; // Updated data for the candidate

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});





router.delete('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter


        const response = await Candidate.findByIdAndDelete(candidateID)

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});





//Lets start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) =>{
    //no admin can vote
    //user can vote only once

    candidateID = req.params.candidateID;
    userID = req.user.id;

    try{
        //Find the candidate document with the specified CandidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: "Candidate not found" });
        }

        const user = await User.findById(userID);
        if(!user){
            return res.status(404).json({ message: "user not found" });
        }

        if(user.isVoted){
            res.status(400).json({ message: "You have already voted" });
        }

        if(user.role === 'admin'){  
            res.status(403).json({message: "admin is not allowed" });
        }

        //Update the candidate document to record the vote
        candidate.votes.push({user: user})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        res.status(200).json({ message: "Vote Recorded Successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})





//Vote Count
router.get('/vote/count', async (req,res)=>{
    try{
        //Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data) =>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    })





    // Get List of all candidates with only name and party fields
    router.get('/candidate', async (req, res) =>{
        try{
            // List of candidates and select only the name and party fields, excluding _id
            const candidates = await Candidate.find({}, 'name party -_id');

            //Return the list of candidates
            res.status(200).json(candidates);
        }catch(err){
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'}); 
        }
    })




module.exports = router;