import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, markdown } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json(
                { error: 'Valid Note ID is required.' },
                { status: 400 }
            );
        }

        if (!markdown || typeof markdown !== 'string') {
            return NextResponse.json(
                { error: 'Markdown content is required.' },
                { status: 400 }
            );
        }

        const updatedNote = await prisma.note.update({
            where: { id },
            data: {
                status: 'Done',
                markdown,
            },
        });

        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        console.error('Error updating note to Done:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
