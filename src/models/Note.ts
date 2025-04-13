import { Schema, model, models } from 'mongoose';

const noteSchema = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Note = models.Note || model('Note', noteSchema);

export default Note;
