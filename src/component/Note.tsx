import style from '../style/Note.module.css'
import styles from '../style/utils.module.css'
import { Card } from 'react-bootstrap'
import {Note as NoteModel} from '../models/note'
import { formatDate } from '../utils/formatDate'
import {MdDelete} from 'react-icons/md'
interface NoteProps {
    note:NoteModel,
    onNoteClick:(note:NoteModel) => void,
    onDeleteNoteClick:(note:NoteModel) => void,
    className?: string
}

const Note = ({note,onDeleteNoteClick, onNoteClick,className}:NoteProps) => {
    const {title,text,updatedAt,createdAt} = note

    let CreartedUpdatedDate:string;
    if(updatedAt > createdAt){
        CreartedUpdatedDate = "Updated: " + formatDate(updatedAt)
    } else {
        CreartedUpdatedDate = "Created " + formatDate(createdAt)
    }


  return (
    <Card className={`${style.noteCard} ${className}`} onClick={() => (onNoteClick(note))}>
        <Card.Body className={style.cardBody}>
            <Card.Title className={styles.flexCenter}>
                {title}
                 <MdDelete  className='text-muted ms-auto deleteNote' onClick={(e:any) => {
        onDeleteNoteClick(note);
        e.stopPropagation();
    } }/>
            </Card.Title>
            <Card.Text className={style.cardText}>
                {text}
            </Card.Text>
            <Card.Footer className='text-muted'>
                {CreartedUpdatedDate}
            </Card.Footer>
        </Card.Body>
    </Card>
  )
}
 
export default Note