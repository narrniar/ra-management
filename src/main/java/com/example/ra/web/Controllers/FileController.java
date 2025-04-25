package com.example.ra.web.Controllers;


import com.example.ra.google_drive.GoogleDriveService;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.FILE.CHILDREN.Report;
import com.example.ra.persistence.models.FILE.File;
import com.example.ra.web.DTO.FileRequestDto;
import com.example.ra.web.DTO.GetFilesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.InputStreamResource;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/file/report")
@RequiredArgsConstructor
public class FileController {

    private final UserRepository userRepository;
    private final GoogleDriveService googleDriveService;

    /**
     * Get all files submitted by a specific RA (Research Assistant) by email.
     */
    @PostMapping("/all")
    public ResponseEntity<List<File>> getFilesByEmail(@RequestBody GetFilesDto request) {
        var user = userRepository.findByEmail(request.getEmail());

        List<File> files = user.getFiles(); // Assuming this includes reports/contracts

        return ResponseEntity.ok(files);
    }

    @PostMapping("/pdf")
    public ResponseEntity<?> getPdfFileByEmailAndTitle(@RequestBody FileRequestDto request) throws IOException, GeneralSecurityException {
        var user = userRepository.findByEmail(request.getEmail());

        // Filter only reports and cast them
        Report matchedReport = user.getFiles().stream()
                .filter(f -> f instanceof Report)
                .map(f -> (Report) f)
                .filter(r -> r.getReport_title().equalsIgnoreCase(request.getReportTitle()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Report not found: " + request.getReportTitle()));

        String fileId = matchedReport.getFileCode();

        InputStream inputStream = googleDriveService.downloadFileAsStream(fileId);

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=\"" + matchedReport.getReport_title() + ".pdf\"")
                .header("Content-Type", "application/pdf")
                .body(new InputStreamResource(inputStream));
    }


    /**
     * Get all files submitted by a specific RA (Research Assistant) by email.
     */
}
