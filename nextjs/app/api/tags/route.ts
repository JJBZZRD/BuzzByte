import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return hardcoded list of tags since we don't have a projectTag model
    const tags = [
      { name: 'AI' },
      { name: 'Machine Learning' },
      { name: 'Web Development' },
      { name: 'Full Stack' },
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'Python' },
      { name: 'Data Science' },
      { name: 'UX/UI Design' }
    ];

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
} 