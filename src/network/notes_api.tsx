import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?:RequestInit){
    const response = await fetch(input, init);
  if(response.ok){
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw new Error(errorMessage);
  }
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData('http://localhost:5000/api/notes',{method: "GET"})
  return await response.json()

}

export interface NoteInput {
  title:string;
  text:string;
}
export async function createNotes(note:NoteInput): Promise<Note> {
  const response = await fetchData('http://localhost:5000/api/notes',
  {method: "POST",
  headers :{
    "content-type": "application/json"
  },
  body: JSON.stringify(note)
})
  return await response.json()

}
export async function DeleteNotes(id:string){
 await fetchData('http://localhost:5000/api/notes/'+id,
  {method: "DELETE",
})
}
export async function updateNotes(id:string, note:NoteInput): Promise<Note>{
  const response = await fetchData('http://localhost:5000/api/notes/'+id,
   {
    method: "PATCH",
    headers :{
      "content-type": "application/json"
    },
    body: JSON.stringify(note)
 })
 return await response.json()
 }