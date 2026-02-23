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

        let note;
        try {
            note = await prisma.note.create({
                data: {
                    content,
                },
            });
        } catch (error: any) {
            // Prisma throws P2021 when the table does not exist in the database
            if (error.code === 'P2021') {
                console.log('Table Note does not exist. Creating it now...');
                // Create the enum first if it doesn't exist
                await prisma.$executeRawUnsafe(`
                    DO $$ 
                    BEGIN
                        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NoteStatus') THEN
                            CREATE TYPE "NoteStatus" AS ENUM ('Backlog', 'Failed', 'Done', 'Archive');
                        END IF;
                    END $$;
                `);

                // Create the Note table
                await prisma.$executeRawUnsafe(`
                    CREATE TABLE IF NOT EXISTS "Note" (
                        "id" TEXT NOT NULL,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "content" TEXT NOT NULL,
                        "markdown" TEXT,
                        "status" "NoteStatus" NOT NULL DEFAULT 'Backlog',

                        CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
                    );
                `);

                console.log('Table Note created. Retrying insert...');
                // Retry the insert
                note = await prisma.note.create({
                    data: {
                        content,
                    },
                });
            } else {
                throw error; // Re-throw if it's a different error
            }
        }

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
