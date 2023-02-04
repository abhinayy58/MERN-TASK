import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
export const getSingleNotes: RequestHandler = async (req, res, next) => {
  try {
    const ids = req.params.id;
    if (!mongoose.isValidObjectId(ids)) {
      throw createHttpError(400, "Invalid Id");
    }
    const singleNotes = await NoteModel.findById({ _id: ids }).exec();
    if (!singleNotes) {
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(singleNotes);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNotes: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  try {
    const { title, text } = req.body;
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }
    const newNotes = await NoteModel.create({ title, text });

    res.status(201).json(newNotes);
  } catch (error) {
    next(error);
  }
};
interface updateNoteParams {
  id: string;
}
interface updateNoteBody {
  title?: string;
  text?: string;
}

export const updateNotes: RequestHandler<
  updateNoteParams,
  unknown,
  updateNoteBody,
  unknown
> = async (req, res, next) => {
  try {
    const ids = req.params.id;
    if (!mongoose.isValidObjectId(ids)) {
      throw createHttpError(400, "Invalid Id");
    }

    if (!req.body.title) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await NoteModel.findById(ids).exec();

    if (!note) {
      throw createHttpError(400, "Note not found");
    }

    note.title = req.body.title;
    note.text = req.body.text;

    const updateNote = await note.save();

    // const updateNotes = await NoteModel.findByIdAndUpdate({_id:ids},{$set:req.body},{new:true});
    // const updateNotes = await NoteModel.findByIdAndUpdate({_id:ids},{title:req.body.title,text:req.body.text},{new:true});
    res.status(200).json(updateNote);
  } catch (error) {
    next(error);
  }
};

export const deleteSingleNotes: RequestHandler = async (req, res, next) => {
  try {
    const ids = req.params.id;
    if (!mongoose.isValidObjectId(ids)) {
      throw createHttpError(400, "Invalid Id");
    }
    const note = await NoteModel.findById(ids).exec();
    if (!note) {
      throw createHttpError(400, "Note not found");
    }

    await note.remove();
    res.status(200).json({ message: "Successfuly Deleted the Note" });

    // const deleteNotes = await NoteModel.findByIdAndDelete({_id:ids}).exec();
    // if(deleteNotes){
    // res.status(200).json({"message":"Successfuly Deleted the Note"});
    // }
  } catch (error) {
    next(error);
  }
};
