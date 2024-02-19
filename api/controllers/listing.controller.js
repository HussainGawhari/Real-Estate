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
