package com.example.ra.web.Controllers;

import com.example.ra.google_drive.GoogleDriveService;
import com.example.ra.persistence.dao.FileRepository;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.services.UserService;
import com.example.ra.web.DTO.RequestReport;
import com.example.ra.web.Services.reportService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/generate")
public class reportController {

    private final reportService reportService;
    private final GoogleDriveService googleDriveService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    @PostMapping("/report")
    public ResponseEntity<InputStreamResource> generateReport(@RequestBody RequestReport requestReport) throws IOException, GeneralSecurityException {
        // Convert request report to a map of data
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> reportData = objectMapper.convertValue(requestReport, new TypeReference<Map<String, Object>>() {});


        // Generate the report file
        File file = reportService.generateReport(reportData);

        // Upload the file to Google Drive
        String folder_id = googleDriveService.getFolderId(requestReport.getRa_email());
        String file_code = googleDriveService.uploadFile(file, folder_id, requestReport.getReport_title());

        // Create and save the file entity in the database
        com.example.ra.persistence.models.FILE.File fileEntity =
                com.example.ra.persistence.models.FILE.CHILDREN.Report.builder()
                        .report_title(requestReport.getReport_title())
                        .fileCode(file_code)
                        .user(userRepository.findByEmail(requestReport.getRa_email()))
                        .status("PENDING")
                        .build();
        fileRepository.save(fileEntity);

        // Add the file entity to the user's file list
        userRepository.findByEmail(requestReport.getRa_email()).getFiles().add(fileEntity);

        // Create InputStreamResource to send the file in the response
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        // Return the file as a stream in the response with the proper content type and headers
        return ResponseEntity.ok()
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=" + file.getName())
                .body(resource);
    }

}
