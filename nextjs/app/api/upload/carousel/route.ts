import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure allowed file types and max size
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const description = formData.get('description') as string || '';
    
    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate project ID
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }
    
    // Create a unique filename with original extension
    const extension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    
    // Define upload path - relative to project root, grouped by project ID
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', projectId);
    const filePath = path.join(uploadDir, fileName);
    
    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Get file data as ArrayBuffer and write to file
    const fileBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));
    
    // Return the path that can be used in <img> src
    const publicPath = `/uploads/projects/${projectId}/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      id: uuidv4(), // Generate a client ID for the image
      url: publicPath,
      fileName: fileName,
      originalName: file.name,
      description: description
    });
    
  } catch (error) {
    console.error('Error uploading carousel image:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the image' },
      { status: 500 }
    );
  }
} 