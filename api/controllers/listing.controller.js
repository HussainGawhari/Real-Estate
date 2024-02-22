import express from "express";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  console.log(listing);

  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(404, "you can delete only your own listing"));
  }
  try {
    console.log("try block");
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("List has been deleted");
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "listing not found"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(404, "You can only update your own list"));
  try {
   const updateList =  await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updateList);
  } catch (err) {
    next(err);
  }
};

export const getListing = async(req, res, next)=>{

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    console.log("Listing ");
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

export const getListings = async(req, res, next) =>{
  try{
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === 'false' || offer === undefined) {
      offer = { $in: [ true, false ] };
  }
  let furnished = req.query.furnished;

  if (furnished === undefined || furnished === 'false') {
    furnished = { $in: [ true, false ] };
  }
  let parking = req.query.park;
  if (parking === undefined || parking === 'false'){
    parking = { $in: [ true, false ] };
  }
  let type = req.query.type;

  if ( type === 'all' || type === undefined){
    type = {$in: ['sale','rent']};
  }
  const searchTerm = req.query.searchTerm || '';
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'desc';

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: 'i' },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json(listings);

  }catch(err){
    next(err);
  }
};
