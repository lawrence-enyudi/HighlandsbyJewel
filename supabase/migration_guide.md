# Project Manager V2 Migration Guide

## Overview
This migration moves the Project Manager from JSON-based storage to proper Supabase relational tables and Supabase Storage for images. This resolves photo reversion issues and provides better data structure.

## Changes Made

### 1. New Database Schema
- **projects_v2**: Main project information (relational table)
- **project_images**: Image references with Supabase Storage URLs
- **payment_terms**: Payment schemes (relational table)
- **inventory**: Lot/unit inventory (relational table)

### 2. Supabase Storage
- **project-images bucket**: Stores actual image files
- Public access enabled for viewing images
- Proper storage policies for upload/delete

### 3. Code Changes
- **cloudSyncV2.ts**: New sync logic using relational tables
- **imageStorage.ts**: Image upload/delete utilities
- **ProjectsManager.tsx**: Updated to use Supabase Storage
- **SiteContext.tsx**: Updated to use V2 sync

## Setup Instructions

### Step 1: Run SQL Scripts in Supabase

1. **Create the new schema**:
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/schema_v2.sql`

2. **Set up Storage**:
   - Run `supabase/storage_setup.sql`

### Step 2: Update Environment Variables

Ensure your `.env.local` has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### Step 3: Migrate Existing Data (Optional)

If you have existing projects in the old JSON format, you can migrate them:

1. The app will automatically use the new V2 schema
2. Old projects in localStorage will be migrated when you first save them
3. Images stored as data URLs will be migrated to Supabase Storage on next save

### Step 4: Test the New System

1. Start the dev server: `npm run dev`
2. Access Admin Portal: Press `Alt + A` or add `#admin`
3. Login with PIN: `jewel2026`
4. Go to "Projects, Inventory & Computations"
5. Test:
   - Add a new project
   - Upload images (should go to Supabase Storage)
   - Add inventory items
   - Configure payment schemes
   - Edit and delete projects

## Benefits of V2

### Resolved Issues
- ✅ **No more photo reversion**: Images stored in Supabase Storage, not JSON
- ✅ **Better performance**: Relational queries instead of large JSON blobs
- ✅ **Proper data structure**: Each data type in its own table
- ✅ **Real-time sync**: Individual table subscriptions for better performance

### New Features
- ✅ **Image management**: Remove individual images, proper storage cleanup
- ✅ **Loading states**: Visual feedback during uploads
- ✅ **Error handling**: Better error messages and fallbacks
- ✅ **UUID IDs**: Proper unique identifiers instead of timestamps

## Rollback Plan

If you need to rollback to the old system:

1. Restore the old `cloudSync.ts` (rename `cloudSyncV2.ts` to `cloudSync.ts`)
2. Update imports in `SiteContext.tsx` to use old table names
3. Revert `ProjectsManager.tsx` changes
4. Data in localStorage will still work with old system

## Troubleshooting

### Images not uploading
- Check Supabase Storage bucket exists: `project-images`
- Verify storage policies allow public upload
- Check browser console for specific errors

### Projects not syncing
- Verify V2 tables exist in Supabase
- Check RLS policies allow public read/write
- Ensure Supabase URL and key are correct

### Migration issues
- Old projects will work but won't sync until edited
- Data URL images will be migrated on next save
- Check browser console for migration errors

## Performance Considerations

- **Image uploads**: Now use Supabase Storage (faster, no base64 bloat)
- **Database queries**: Relational queries are more efficient
- **Real-time sync**: Individual table subscriptions reduce bandwidth
- **Payload size**: Significantly reduced without embedded images in JSON

## Future Enhancements

Potential improvements for future versions:
- Image compression before upload
- CDN integration for faster image delivery
- Image thumbnails for better UI performance
- Batch operations for bulk updates
- Version history for project changes