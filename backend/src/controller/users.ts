import  createHttpError  from 'http-errors';
import { RequestHandler, response } from "express";
import userModel from '../models/user'
import bcrypt from 'bcrypt';
interface signUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const getAuthenticatedUser:RequestHandler = async(req,res,next) => {
    const authencticUser = req.session.userId
try {
    if(!authencticUser) {
        throw createHttpError(401, "User not authenticated")
    }
    const user = await userModel.findById(authencticUser).select("+email").exec()
    res.status(200).json(user)
} catch (error) {
    next(error);
}
}

export const signUp:RequestHandler<unknown, unknown,signUpBody, unknown> = async (req,res,next) => {
  console.log(req.body)
    const {username,email,password} = req.body;
try {
    if(!username || !email || !password) {
       throw createHttpError(400,"Parameter Missing!")
    }
    const existingUserName = await userModel.findOne({username:username}).exec()
    if(existingUserName) {
        throw createHttpError(409,"UserName already exists taken Please Choose another user name")
    }
    const existingEmail = await userModel.findOne({email:email}).exec()
    if(existingEmail) {
        throw createHttpError(409,"User with this email  already exists Please Login")
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHashed = await bcrypt.hash(password, salt);
  const newUser = await userModel.create({
    username: username,
    email: email,
    password: passwordHashed,
  })

  req.session.userId = newUser._id

  res.status(201).json(newUser);



} catch (error) {
    next(error);
}
} 

interface LoginBody {
    username?: string,
    password?: string,
}

export const login:RequestHandler<unknown, unknown,LoginBody,unknown> = async(req,res,next) => {

    const {username,password} = req.body

    try {
        
        if(!username || !password) {
            throw createHttpError(400,"Parameter missing")
        }

        const user = await userModel.findOne({ username: username}).select("+password +email").exec()

        if(!user) {
            throw createHttpError(401,"Inavlid credentials")
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch) {
           throw createHttpError(401,"Invalid Credentials")
        }

        req.session.userId = user._id
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }

}

export const logout:RequestHandler=(req,res,next) => {
    req.session.destroy(error => {
        if(error) {
            next(error)
        } else {
            res.sendStatus(200)
        }
    })
}
