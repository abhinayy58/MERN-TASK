import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";
interface AddUpdateNoteDialogProps {
    notetoEdit?:Note,
    onDismiss: () => void,
    onNoteSaved:(note:Note) => void,
}


// eslint-disable-next-line @typescript-eslint/no-redeclare
const AddNoteDialog = ({notetoEdit,onDismiss,onNoteSaved}:AddUpdateNoteDialogProps) => {
    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<NoteInput>(
      {
        defaultValues:{
          title: notetoEdit?.title || "",
          text: notetoEdit?.text || "",
        }
      }
    )

    async function onSubmit(input: NoteInput){
        try {
     let noteResponse: Note;
     if(notetoEdit) {
      noteResponse = await NoteApi.updateNotes(notetoEdit._id,input)
     }else {
        noteResponse = await NoteApi.createNotes(input)
        } 
        onNoteSaved(noteResponse)
      }catch (error) {
            console.error(error);
            alert(error);
        }
    }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {notetoEdit ? "Edit Note" : "Add Note"}
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
            type="text"
            placeholder="Title"
            isInvalid={!!errors.title}
            {...register("title",{required:"required"})}
            />
            <Form.Control.Feedback type="invalid">
                {errors.title?.message}
            </Form.Control.Feedback>
            <Form.Label>Text</Form.Label>
            <Form.Control 
           as="textarea"
           rows={5}
           placeholder="Text"
           {...register("text",{required:"required"})}
            />
        </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
        type="submit"
        form="addNoteForm"
        disabled={isSubmitting}
        >
            Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNoteDialog;
