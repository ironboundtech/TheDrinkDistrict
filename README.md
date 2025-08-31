# Sports Booking System - Court Management Image Upload Feature

## Overview
The Court Management feature now supports **file upload** for court images instead of URL inputs. This provides a more user-friendly experience for administrators to upload court images directly from their devices.

## Features

### Image Upload Functionality
- **File Upload Button**: Replace URL input with a file upload button
- **Image Preview**: Real-time preview of selected images before upload
- **File Validation**: Only accepts image files (jpg, png, gif, etc.)
- **File Size Limit**: Maximum 5MB per image
- **Automatic Storage**: Images are automatically saved to the server's uploads directory

### Technical Implementation

#### Backend Changes
- **Multer Integration**: Added `multer` middleware for handling file uploads
- **File Storage**: Images stored in `backend/uploads/courts/` directory
- **Static File Serving**: Images served via `/uploads/courts/` endpoint
- **File Naming**: Unique filenames with timestamps to prevent conflicts

#### Frontend Changes
- **File Input**: Replaced URL input with `<input type="file">`
- **FormData**: Updated API calls to use `FormData` for multipart uploads
- **Image Preview**: Added preview functionality for selected files
- **Error Handling**: Improved error handling for file uploads

## Usage Instructions

### For Administrators

1. **Creating a New Court**:
   - Navigate to Court Management page
   - Click "สร้างสนามใหม่" (Create New Court)
   - Fill in court details (name, address, price, venue, amenities)
   - Click "เลือกไฟล์" (Choose File) to upload an image
   - Preview the selected image
   - Click "สร้างสนาม" (Create Court)

2. **Editing an Existing Court**:
   - Click the edit button (pencil icon) on any court
   - Modify court details as needed
   - Optionally upload a new image to replace the existing one
   - Preview the new image if selected
   - Click "บันทึกการเปลี่ยนแปลง" (Save Changes)

### File Requirements
- **Supported Formats**: JPG, PNG, GIF, WebP, SVG
- **Maximum Size**: 5MB per image
- **Recommended Dimensions**: 300x200 pixels or larger
- **Aspect Ratio**: Any aspect ratio supported

## API Endpoints

### Create Court with Image Upload
```
POST /api/courts
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- name: string (required)
- address: string (required)
- price: number (required)
- venue: string
- amenities: string
- image: file (optional)
```

### Update Court with Image Upload
```
PUT /api/courts/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- name: string (required)
- address: string (required)
- price: number (required)
- venue: string
- status: string (open/closed)
- amenities: string
- image: file (optional)
```

## File Storage Structure
```
backend/
├── uploads/
│   └── courts/
│       ├── court-1703123456789-123456789.jpg
│       ├── court-1703123456790-987654321.png
│       └── ...
```

## Image Display
- **Database Storage**: File paths stored as `/uploads/courts/filename.ext`
- **Frontend Display**: Images served from `http://localhost:5001/uploads/courts/filename.ext`
- **Fallback**: If no image is uploaded, placeholder image is used

## Error Handling
- **File Type Validation**: Only image files accepted
- **Size Limit**: Files over 5MB rejected
- **Upload Errors**: Clear error messages for failed uploads
- **Network Issues**: Graceful handling of connection problems

## Security Considerations
- **File Type Validation**: Server-side validation of file types
- **Size Limits**: Prevents large file uploads
- **Authentication**: Only authenticated admins can upload files
- **Path Traversal**: Secure file naming prevents directory traversal

## Dependencies
- **Backend**: `multer` for file upload handling
- **Frontend**: Native HTML5 file input with FormData API

## Migration Notes
- Existing courts with URL-based images will continue to work
- New courts will use file upload by default
- Placeholder images used when no file is uploaded
- Backward compatibility maintained for existing image URLs
"# TheDrinkDistrict" 
"# TheDrinkDistrict" 
