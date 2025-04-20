package com.example.ra.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
public class GoogleDriveController {

    @Autowired
    private GoogleDriveService service;

    @PostMapping("/api/v1/uploadToGoogleDrive")
    public Object handleFileUpload(@RequestParam("file") MultipartFile file) throws IOException, GeneralSecurityException {
        if (file.isEmpty()) {
            return "File is empty";
        }

        File tempFile = File.createTempFile("gdrive-upload-", null);
        try {
            file.transferTo(tempFile);
            Res res = service.uploadFileToDrive(tempFile);
            System.out.println(res);
            return res;
        } catch (IOException e) {
            if (tempFile.exists()) {
                tempFile.delete(); // Clean up if transfer fails
            }
            throw e;
        }
    }
}
