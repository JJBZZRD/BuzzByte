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
    const projectId = formData.get('projectId') as string;
    
    // Validate project ID
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Get all files from the form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file')) {
        files.push(value as File);
      }
    }
    
    // Check if we have any files
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
    
    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects', projectId);
    
    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Process each file and collect results
    const results = [];
    
    for (const file of files) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        results.push({ 
          success: false, 
          originalName: file.name, 
          error: 'Invalid file type' 
        });
        continue;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        results.push({ 
          success: false, 
          originalName: file.name, 
          error: 'File too large' 
        });
        continue;
      }
      
      try {
        // Create a unique filename with original extension
        const extension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${extension}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Write file to disk
        const fileBuffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(fileBuffer));
        
        // Create the public path
        const publicPath = `/uploads/projects/${projectId}/${fileName}`;
        
        // Add to results
        results.push({
          success: true,
          id: uuidv4(), // Generate a unique ID for the image
          url: publicPath,
          fileName: fileName,
          originalName: file.name,
          description: ''
        });
      } catch (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fileError
      ) {
        results.push({ 
          success: false, 
          originalName: file.name, 
          error: 'Failed to save file' 
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results: results,
      uploadedCount: results.filter(r => r.success).length,
      failedCount: results.filter(r => !r.success).length
    });
    
  } catch (error) {
    console.error('Error processing carousel batch upload:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the upload' },
      { status: 500 }
    );
  }
} 