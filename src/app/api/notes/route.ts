import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Content is required and must be a string.' },
                { status: 400 }
            );
        }

        const note = await prisma.note.create({
            data: {
                content,
                // status is 'Backlog' by default as defined in schema.prisma
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
