//package com.example.ra.web;
//
//import com.example.ra.services.GoogleDriveService;
//import com.google.api.services.drive.model.File;
//import com.google.api.services.drive.model.Permission;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.InputStreamResource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.io.InputStream;
//import java.security.GeneralSecurityException;
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/v1/drive")
//public class DriveController {
//
//    private final GoogleDriveService driveService;
//
//    @Autowired
//    public DriveController(GoogleDriveService driveService) {
//        this.driveService = driveService;
//    }
//
//    /**
//     * Upload a file to Google Drive
//     */
//    @PostMapping("/upload")
//    public ResponseEntity<Map<String, Object>> uploadFile(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam(value = "description", required = false) String description,
//            @RequestParam("mimeType") String mimeType,
//            @RequestParam(value = "folderId", required = false) String folderId) {
//
//        try {
//            File uploadedFile = driveService.uploadFile(file, description, mimeType, folderId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("id", uploadedFile.getId());
//            response.put("name", uploadedFile.getName());
//            response.put("webViewLink", uploadedFile.getWebViewLink());
//            response.put("webContentLink", uploadedFile.getWebContentLink());
//
//            return ResponseEntity.ok(response);
//        } catch (IOException | GeneralSecurityException e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//    /**
//     * Download a file from Google Drive
//     */
//    @GetMapping("/download/{fileId}")
//    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileId) {
//        try {
//            // Get file metadata to determine name and MIME type
//            File fileMetadata = driveService.getFileMetadata(fileId);
//            InputStream inputStream = driveService.downloadFile(fileId);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileMetadata.getName());
//
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .body(new InputStreamResource(inputStream));
//        } catch (IOException | GeneralSecurityException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//    /**
//     * Create a folder in Google Drive
//     */
//    @PostMapping("/folders")
//    public ResponseEntity<Map<String, Object>> createFolder(
//            @RequestParam("name") String folderName,
//            @RequestParam(value = "parentId", required = false) String parentId) {
//
//        try {
//            File folder = driveService.createFolder(folderName, parentId);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("id", folder.getId());
//            response.put("name", folder.getName());
//            response.put("webViewLink", folder.getWebViewLink());
//
//            return ResponseEntity.ok(response);
//        } catch (IOException | GeneralSecurityException e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("error", "Failed to create folder: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//    /**
//     * List files in a folder
//     */
//    @GetMapping("/files")
//    public ResponseEntity<List<File>> listFiles(
//            @RequestParam(value = "folderId", required = false) String folderId,
//            @RequestParam(value = "pageSize", defaultValue = "100") int pageSize) {
//
//        try {
//            List<File> files = driveService.listFilesInFolder(folderId, pageSize);
//            return ResponseEntity.ok(files);
//        } catch (IOException | GeneralSecurityException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
//        }
//    }
//
//    /**
//     * Search for files by name
//     */
//    @GetMapping("/search")
//    public ResponseEntity<List<File>> searchFiles(@RequestParam("query") String query) {
//        try {
//            List<File> files = driveService.searchFilesByName(query);
//            return ResponseEntity.ok(files);
//        } catch (IOException | GeneralSecurityException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
//        }
//    }
//
//    /**
//     * Delete a file or folder
//     */
//    @DeleteMapping("/{fileId}")
//    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String fileId) {
//        Map<String, String> response = new HashMap<>();
//
//        try {
//            driveService.deleteFile(fileId);
//            response.put("message", "File deleted successfully");
//            return ResponseEntity.ok(response);
//        } catch (IOException | GeneralSecurityException e) {
//            response.put("error", "Failed to delete file: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }
//
//    /**
//     * Get file metadata
//     */
//    @GetMapping("/{fileId}")
//    public ResponseEntity<File> getFileMetadata(@PathVariable String fileId) {
//        try {
//            File file = driveService.getFileMetadata(fileId);
//            return ResponseEntity.ok(file);
//        } catch (IOException | GeneralSecurityException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//    /**
//     * Share a file with a user
//     */
//    @PostMapping("/{fileId}/share/user")
//    public ResponseEntity<Map<String, Object>> shareFileWithUser(
//            @PathVariable String fileId,
//            @RequestParam("email") String email,
//            @RequestParam(value = "role", defaultValue = "reader") String role) {
//
//        try {
//            Permission permission = driveService.shareFile(fileId, email, role);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("permissionId", permission.getId());
//            response.put("email", permission.getEmailAddress());
//            response.put("role", permission.getRole());
//
//            return ResponseEntity.ok(response);
//        } catch (IOException | GeneralSecurityException e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("error", "Failed to share file: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//    /**
//     * Share a file with a domain
//     */
//    @PostMapping("/{fileId}/share/domain")
//    public ResponseEntity<Map<String, Object>> shareFileWithDomain(
//            @PathVariable String fileId,
//            @RequestParam("domain") String domain,
//            @RequestParam(value = "role", defaultValue = "reader") String role) {
//
//        try {
//            Permission permission = driveService.shareDomain(fileId, domain, role);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("permissionId", permission.getId());
//            response.put("domain", permission.getDomain());
//            response.put("role", permission.getRole());
//
//            return ResponseEntity.ok(response);
//        } catch (IOException | GeneralSecurityException e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("error", "Failed to share file with domain: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//
//    /**
//     * Make a file public
//     */
//    @PostMapping("/{fileId}/share/public")
//    public ResponseEntity<Map<String, Object>> makeFilePublic(
//            @PathVariable String fileId,
//            @RequestParam(value = "role", defaultValue = "reader") String role) {
//
//        try {
//            Permission permission = driveService.makePublic(fileId, role);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("permissionId", permission.getId());
//            response.put("type", permission.getType());
//            response.put("role", permission.getRole());
//
//            return ResponseEntity.ok(response);
//        } catch (IOException | GeneralSecurityException e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("error", "Failed to make file public: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }
//}