package com.example.ra.services;


import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class GoogleDriveService {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SERVICE_ACOUNT_KEY_PATH = getPathToGoogleCredentials();

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

    public Res uploadFileToDrive(File file) throws GeneralSecurityException, IOException {
        Res res = new Res();

        try {
            String folderId = "1-ZcyAwO-RBylRMcwwLVpeAHN0JJM1xu_";
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


} 