import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json(
                { error: 'Valid Note ID is required.' },
                { status: 400 }
            );
        }

        // Verify if the note exists
        const existingNote = await prisma.note.findUnique({
            where: { id },
        });

        if (!existingNote) {
            return NextResponse.json(
                { error: 'Note not found.' },
                { status: 404 }
            );
        }

        // Delete the note
        await prisma.note.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Note deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
