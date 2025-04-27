import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return hardcoded list of technologies since we don't have a technology model
    const technologies = [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'Python' },
      { name: 'Django' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'TensorFlow' },
      { name: 'PyTorch' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'AWS' },
      { name: 'Azure' }
    ];

    return NextResponse.json(technologies);
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
} 