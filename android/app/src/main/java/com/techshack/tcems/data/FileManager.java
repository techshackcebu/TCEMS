package com.techshack.tcems.data;

import android.content.Context;
import android.net.Uri;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * File Manager utility class
 * Replaces Capacitor Filesystem plugin functionality
 * Handles file I/O operations, directories, and Uri generation
 */
public class FileManager {

    private static final String AUTHORITY_SUFFIX = ".fileprovider";
    private Context context;
    private String authority;

    private static volatile FileManager instance = null;

    private FileManager(Context context) {
        this.context = context.getApplicationContext();
        this.authority = context.getPackageName() + AUTHORITY_SUFFIX;
    }

    public static FileManager getInstance(Context context) {
        if (instance == null) {
            synchronized (FileManager.class) {
                if (instance == null) {
                    instance = new FileManager(context);
                }
            }
        }
        return instance;
    }

    /**
     * Write data to a file in app's documents directory
     */
    public File writeFile(String fileName, byte[] data) throws IOException {
        File documentsDir = new File(context.getFilesDir(), "documents");
        if (!documentsDir.exists()) {
            documentsDir.mkdirs();
        }

        File file = new File(documentsDir, fileName);
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(data);
        }
        return file;
    }

    /**
     * Read file from documents directory
     */
    public byte[] readFile(String fileName) throws IOException {
        File file = new File(context.getFilesDir(), "documents/" + fileName);
        if (!file.exists()) {
            throw new IOException("File not found: " + fileName);
        }
        return readFileBytes(file);
    }

    /**
     * Get list of files in documents directory
     */
    public List<String> listFiles() {
        List<String> files = new ArrayList<>();
        File documentsDir = new File(context.getFilesDir(), "documents");
        if (documentsDir.exists() && documentsDir.isDirectory()) {
            File[] fileArray = documentsDir.listFiles();
            if (fileArray != null) {
                for (File file : fileArray) {
                    if (file.isFile()) {
                        files.add(file.getName());
                    }
                }
            }
        }
        return files;
    }

    /**
     * Delete file from documents directory
     */
    public boolean deleteFile(String fileName) {
        File file = new File(context.getFilesDir(), "documents/" + fileName);
        return file.exists() && file.delete();
    }

    /**
     * Get file Uri for sharing using FileProvider
     */
    public Uri getFileUri(String fileName) {
        File file = new File(context.getFilesDir(), "documents/" + fileName);
        if (file.exists()) {
            return FileProvider.getUriForFile(context, authority, file);
        }
        return null;
    }

    /**
     * Get directory for temporary files
     */
    public File getTempDir() {
        File tempDir = new File(context.getCacheDir(), "temp");
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }
        return tempDir;
    }

    /**
     * Get device storage directory (external storage)
     */
    public File getExternalStorageDir() {
        return context.getExternalFilesDir(null);
    }

    /**
     * Helper method to read bytes from file
     */
    private byte[] readFileBytes(File file) throws IOException {
        byte[] fileContent = new byte[(int) file.length()];
        try (java.io.FileInputStream fis = new java.io.FileInputStream(file)) {
            fis.read(fileContent);
        }
        return fileContent;
    }

    /**
     * Copy file from source to destination
     */
    public void copyFile(File source, File destination) throws IOException {
        if (!destination.getParentFile().exists()) {
            destination.getParentFile().mkdirs();
        }

        byte[] buffer = new byte[1024];
        try (java.io.FileInputStream fis = new java.io.FileInputStream(source);
             FileOutputStream fos = new FileOutputStream(destination)) {
            int length;
            while ((length = fis.read(buffer)) > 0) {
                fos.write(buffer, 0, length);
            }
        }
    }
}

