import express from 'express';

import {getNotes,createNotes,getSingleNotes,deleteSingleNotes,updateNotes} from '../controller/notes'

const router = express.Router();

router.get("/",getNotes );
router.get("/:id",getSingleNotes );
router.post("/",createNotes);
router.patch('/:id',updateNotes)
router.delete("/:id",deleteSingleNotes);

export default router;