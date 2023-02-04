import React, { useEffect, useState } from "react";
import "./App.css";
import { Note as NoteModel } from "./models/note";
import Note from "./component/Note";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import styles from "./style/NotesPage.module.css";
import styleUtils from "./style/utils.module.css";
import * as NoteApi from "./network/notes_api";
import AddNoteDialog from "./component/AddNoteDialog";
import { FaPlus } from "react-icons/fa";
import { set } from "react-hook-form";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [noteLoading, setNoteLoading] = useState(true);
  const [showNoteLoadingError, setShowNoteLoadingError] = useState(false);

  const [showAddNote, setShowAddNote] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNoteLoadingError(false);
        setNoteLoading(true)
        const notes = await NoteApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.log(error);
        setShowNoteLoadingError(true);
      } finally {
        setNoteLoading(false)
      }
    }
    loadNotes();
  }, []);
  const showAddNoteClickHanlder = () => {
    setShowAddNote(true);
  };
  const hideAddNoteClickHanlder = () => {
    setShowAddNote(false);
  };
  async function deleteNotes(note: NoteModel) {
    try {
      await NoteApi.DeleteNotes(note._id);
      setNotes(notes.filter((existingNotes) => existingNotes._id !== note._id));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const noteGrid = <Row xs={1} md={2} xl={3} xxl={4} className={`"g-4" ${styles.noteGrid}`}>
  {notes.map((note) => (
    <Col key={note._id}>
      <Note
        note={note}
        className={styles.note}
        onNoteClick={setNoteToEdit}
        onDeleteNoteClick={deleteNotes}
      />
    </Col>
  ))}
</Row>

  return (
    <Container className={styles.notePage}>
      <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={showAddNoteClickHanlder}
      >
        {" "}
        <FaPlus />
        Add New Note
      </Button>
      {noteLoading && <Spinner animation="border" variant="primary" />}
      {showNoteLoadingError && <p>SomeThing Went Wrong Refresh the page</p>}
      {!noteLoading && !showNoteLoadingError && <>
      {
        notes.length > 0 ? noteGrid : <p>You don't have any notes</p>
      }
      </>
      }
      {showAddNote && (
        <AddNoteDialog
          onDismiss={hideAddNoteClickHanlder}
          onNoteSaved={(newnotes) => {
            setNotes([...notes, newnotes]);
            setShowAddNote(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddNoteDialog
          notetoEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updateNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updateNote._id ? updateNote : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </Container>
  );
}

export default App;
