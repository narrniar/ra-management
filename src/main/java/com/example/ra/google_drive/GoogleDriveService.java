package com.example.ra.google_drive;


import com.example.ra.google_drive.Dto.Res;
import com.example.ra.persistence.dao.FileRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.FileList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RequiredArgsConstructor
@Service
public class GoogleDriveService {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SERVICE_ACOUNT_KEY_PATH = getPathToGoogleCredentials();
    private static final String DEFAULT_ROOT_FOLDER_ID = "1-ZcyAwO-RBylRMcwwLVpeAHN0JJM1xu_";
    private final FileRepository fileRepository;

    private static String getPathToGoogleCredentials() {
        try {
            URL resource = ClassLoader.getSystemResource("credentials.json");
            if (resource == null) {
                throw new IllegalArgumentException("File credentials.json not found in resources");
            }
            return Paths.get(resource.toURI()).toString();
        } catch (URISyntaxException e) {
            throw new RuntimeException("Error getting path to credentials file", e);
        }
    }

    public String createFolder(String folderName) throws IOException, GeneralSecurityException {
        return createFolder(folderName, DEFAULT_ROOT_FOLDER_ID);
    }

    public String createFolder(String folderName, String parentFolderId) throws IOException, GeneralSecurityException {
        Res res = new Res();

        try {
            Drive drive = createDriveService();

            // Check if folder with the same name already exists
            String query = String.format("name='%s' and mimeType='application/vnd.google-apps.folder' and '%s' in parents and trashed=false",
                    folderName.replace("'", "\\'"), parentFolderId);

            FileList result = drive.files().list()
                    .setQ(query)
                    .setSpaces("drive")
                    .setFields("files(id, name)")
                    .execute();

            if (!result.getFiles().isEmpty()) {
                String existingFolderId = result.getFiles().get(0).getId();
                return "folder already Exists";
            }

            // Create folder metadata
            com.google.api.services.drive.model.File folderMetadata = new com.google.api.services.drive.model.File();
            folderMetadata.setName(folderName);
            folderMetadata.setMimeType("application/vnd.google-apps.folder");
            folderMetadata.setParents(Collections.singletonList(parentFolderId));

            // Create the folder
            com.google.api.services.drive.model.File folder = drive.files().create(folderMetadata)
                    .setFields("id")
                    .execute();

            return folder.getId();

        } catch (Exception e) {
            return "Error creating folder: " + e.getMessage();
        }

    }

    public String uploadFile(File file, String folderId, String fileName) throws IOException, GeneralSecurityException {
        Res res = new Res();

        try {
            Drive drive = createDriveService();
            String targetFolderId = folderId != null && !folderId.isEmpty() ? folderId : DEFAULT_ROOT_FOLDER_ID;

            // Create file metadata
            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            // Use custom filename if provided, otherwise use original filename
            fileMetaData.setName(fileName != null ? fileName : file.getName());
            fileMetaData.setParents(Collections.singletonList(targetFolderId));

            // Detect MIME type based on file extension
            String mimeType = Files.probeContentType(file.toPath());
            if (mimeType == null) {
                mimeType = "application/octet-stream"; // Default MIME type if unable to determine
            }

            // Create file content with appropriate MIME type
            FileContent mediaContent = new FileContent(mimeType, file);

            // Upload file to Drive
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id, webViewLink")
                    .execute();



//            // Set response details
//            res.setStatus(200);
//            res.setMessage("File Successfully Uploaded To Drive");
//            res.setUrl(fileUrl);
//            res.setFileId(uploadedFile.getId());
//
            return uploadedFile.getId();
        } catch (Exception e) {
            res.setStatus(500);
            res.setMessage("Error uploading file: " + e.getMessage());
            return "Error uploading file";
        }
    }
    public Res uploadFileToDrive(File file) throws GeneralSecurityException, IOException {
        Res res = new Res();

        try {
            String folderId = DEFAULT_ROOT_FOLDER_ID; // Default folder ID
            Drive drive = createDriveService();

            // Create file metadata
            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getName());
            fileMetaData.setParents(Collections.singletonList(folderId));

            // Detect MIME type based on file extension
            String mimeType = Files.probeContentType(file.toPath());
            if (mimeType == null) {
                mimeType = "application/octet-stream"; // Default MIME type if unable to determine
            }

            // Create file content with appropriate MIME type
            FileContent mediaContent = new FileContent(mimeType, file);

            // Upload file to Drive
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id, webViewLink").execute();

            // Generate direct access URL
            String fileUrl = "https://drive.google.com/uc?export=view&id=" + uploadedFile.getId();
            System.out.println("FILE URL: " + fileUrl);

            // Delete local file after upload
            file.delete();

            // Set response details
            res.setStatus(200);
            res.setMessage("File Successfully Uploaded To Drive");
            res.setUrl(fileUrl);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            res.setStatus(500);
            res.setMessage(e.getMessage());
        }

        return res;
    }

    private Drive createDriveService() throws GeneralSecurityException, IOException {

        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream(SERVICE_ACOUNT_KEY_PATH))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                credential)
                .build();

    }

    public String getFolderId(String folderName) throws IOException, GeneralSecurityException {
        Drive drive = createDriveService();

        String query = String.format("name='%s' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                folderName.replace("'", "\\'"));

        FileList result = drive.files().list()
                .setQ(query)
                .setSpaces("drive")
                .setFields("files(id, name)")
                .execute();

        if (!result.getFiles().isEmpty()) {
            return result.getFiles().get(0).getId(); // Return the first matching folder's ID
        } else {
            return null; // Folder not found
        }
    }

    public String getDownloadUrlByName(String fileName, String folderId) throws IOException, GeneralSecurityException {
        Drive drive = createDriveService();

        // Escape single quotes
        String escapedFileName = fileName.replace("'", "\\'");

        String query = String.format("name='%s' and '%s' in parents and trashed=false",
                escapedFileName, folderId);

        FileList result = drive.files().list()
                .setQ(query)
                .setSpaces("drive")
                .setFields("files(id, name)")
                .execute();

        if (result.getFiles().isEmpty()) {
            return null; // or throw an exception if you prefer
        }

        String fileId = result.getFiles().get(0).getId();

        // Return a direct Google Drive viewing link
        return "https://drive.google.com/uc?export=download&id=" + fileId;
    }

    public String getDownloadUrlByName(String fileName) throws IOException, GeneralSecurityException {
        return getDownloadUrlByName(fileName, DEFAULT_ROOT_FOLDER_ID);
    }


}