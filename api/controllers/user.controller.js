import { errorHandler } from "../utils/error.js";
import bcryptjs  from 'bcryptjs';
import User from '../models/user.model.js';
export const test = (req, res) => {
  res.json({
    message: "test message received",
  });
};

export const updateUser = async (req, res, next) => {
  console.log(req.params.id==req.user.id);
  console.log("data from update req.body",req.body);
  if (req.user.id !== req.params.id)
 

    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } // Corrected spelling of 'new'
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
