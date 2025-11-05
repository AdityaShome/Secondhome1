# Uploads Directory

This directory stores property images uploaded by property owners.

## 📁 Usage

- Images are automatically uploaded here when property owners submit listings
- Files are named with UUID to prevent conflicts
- This directory should exist but uploaded files should not be committed to git

## 🚨 Important

- **DO NOT** commit uploaded files to git
- **DO NOT** delete this directory
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

## 🔒 Security

- Files are validated on upload (file type, size)
- Only authenticated users can upload
- Images are publicly accessible via `/uploads/filename.ext`

