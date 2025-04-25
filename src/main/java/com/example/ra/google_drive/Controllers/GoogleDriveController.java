package com.example.ra.google_drive.Controllers;

import com.example.ra.google_drive.GoogleDriveService;
import com.example.ra.google_drive.Dto.Res;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/drive")
public class GoogleDriveController {

    @Autowired
    private GoogleDriveService service;

    /**
     * Upload a file to the default Google Drive folder
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws IOException, GeneralSecurityException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        File tempFile = File.createTempFile("gdrive-upload-", null);
        try {
            file.transferTo(tempFile);
            Res res = service.uploadFileToDrive(tempFile);
            return ResponseEntity.ok(res);
        } catch (IOException e) {
            if (tempFile.exists()) {
                tempFile.delete(); // Clean up if transfer fails
            }
            throw e;
        }
    }

    /**
     * Upload a file to a specific Google Drive folder using folder ID
     */
    @PostMapping("/upload/folder/{folderId}")
    public ResponseEntity<?> uploadFileToFolder(
            @RequestParam("file") MultipartFile file,
            @PathVariable String folderId,
            @RequestParam(value = "fileName", required = false) String fileName) throws IOException, GeneralSecurityException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        File tempFile = File.createTempFile("gdrive-upload-", null);
        try {
            file.transferTo(tempFile);
            String fileId = service.uploadFile(tempFile, folderId, fileName);

            Map<String, Object> response = new HashMap<>();
            response.put("fileId", fileId);
            response.put("viewUrl", "https://drive.google.com/file/d/" + fileId + "/view");
            response.put("downloadUrl", "https://drive.google.com/uc?export=download&id=" + fileId);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            if (tempFile.exists()) {
                tempFile.delete(); // Clean up if transfer fails
            }
            throw e;
        }
    }

    /**
     * Create a folder in the default Google Drive root folder
     */
    @PostMapping("/folder")
    public ResponseEntity<?> createFolder(@RequestParam("folderName") String folderName) throws IOException, GeneralSecurityException {
        String result = service.createFolder(folderName);

        if (result.startsWith("Error")) {
            return ResponseEntity.badRequest().body(result);
        } else if (result.equals("folder already Exists")) {
            return ResponseEntity.ok().body(Map.of(
                    "message", "Folder already exists",
                    "status", "EXISTS"
            ));
        } else {
            return ResponseEntity.ok().body(Map.of(
                    "folderId", result,
                    "status", "CREATED"
            ));
        }
    }

    /**
     * Create a folder in a specific parent folder in Google Drive
     */
    @PostMapping("/folder/{parentFolderId}")
    public ResponseEntity<?> createSubFolder(
            @RequestParam("folderName") String folderName,
            @PathVariable String parentFolderId) throws IOException, GeneralSecurityException {

        String result = service.createFolder(folderName, parentFolderId);

        if (result.startsWith("Error")) {
            return ResponseEntity.badRequest().body(result);
        } else if (result.equals("folder already Exists")) {
            return ResponseEntity.ok().body(Map.of(
                    "message", "Folder already exists",
                    "status", "EXISTS"
            ));
        } else {
            return ResponseEntity.ok().body(Map.of(
                    "folderId", result,
                    "status", "CREATED"
            ));
        }
    }

    /**
     * Upload a file with a custom name to Google Drive
     */
    @PostMapping("/upload/rename")
    public ResponseEntity<?> uploadFileWithCustomName(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileName") String fileName) throws IOException, GeneralSecurityException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        File tempFile = File.createTempFile("gdrive-upload-", null);
        try {
            file.transferTo(tempFile);
            String fileId = service.uploadFile(tempFile, null, fileName);

            Map<String, Object> response = new HashMap<>();
            response.put("fileId", fileId);
            response.put("fileName", fileName);
            response.put("viewUrl", "https://drive.google.com/file/d/" + fileId + "/view");
            response.put("downloadUrl", "https://drive.google.com/uc?export=download&id=" + fileId);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            if (tempFile.exists()) {
                tempFile.delete(); // Clean up if transfer fails
            }
            throw e;
        }
    }

    /**
     * Handle errors in the controller
     */
    @ExceptionHandler({IOException.class, GeneralSecurityException.class})
    public ResponseEntity<?> handleException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(500).body(error);
    }


}