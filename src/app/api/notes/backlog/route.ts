import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const backlogNotes = await prisma.note.findMany({
            where: {
                status: 'Backlog',
            },
            orderBy: {
                createdAt: 'asc', // Process oldest first
            },
        });

        return NextResponse.json(backlogNotes, { status: 200 });
    } catch (error) {
        console.error('Error fetching backlog notes:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
