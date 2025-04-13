import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

export async function POST(req: NextRequest) {
  try {
    await dbConnect(process.env.MONGODB_DB_2);

    const { content, noteId } = await req.json();

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    if (noteId) {
      const existingNote = await Note.findById(noteId);
      if (!existingNote) {
        return NextResponse.json({ message: 'Note not found' }, { status: 404 });
      }
      existingNote.content = content;
      await existingNote.save();
      return NextResponse.json({ message: 'Note updated successfully', note: existingNote });
    } else {
      const newNote = new Note({
        content,
      });

      await newNote.save();
      return NextResponse.json({ message: 'Note created successfully', note: newNote });
    }
  } catch (err) {
    console.error('Error creating or updating note:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect(process.env.MONGODB_DB_2);

    const notes = await Note.find().sort({ createdAt: -1 });

    return NextResponse.json({ notes });
  } catch (err) {
    console.error('Error fetching notes:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
