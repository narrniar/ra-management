package com.example.ra.web.Controllers;


import com.example.ra.google_drive.GoogleDriveService;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.FILE.CHILDREN.Report;
import com.example.ra.persistence.models.FILE.File;
import com.example.ra.persistence.models.User;
import com.example.ra.web.DTO.FileRequestDto;
import com.example.ra.web.DTO.GetFilesDto;
import com.example.ra.web.DTO.GetProfessorFilesDto;
import com.example.ra.web.DTO.UpdateStatusDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.InputStreamResource;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @PostMapping("/prof/all")
    public ResponseEntity<List<Map<String, Object>>> getAllReportsForProfessor(@RequestBody GetProfessorFilesDto request) {
        List<Map<String, Object>> responses = userRepository.findAll().stream()
                .filter(user -> request.getProfessorEmail().equalsIgnoreCase(user.getProfessor_email()))
                .flatMap(user -> user.getFiles().stream())
                .filter(f -> f instanceof Report)
                .map(f -> (Report) f)
                .map(report -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("raFirstName", report.getUser().getFirstName());
                    map.put("raLastName", report.getUser().getLastName());
                    map.put("reportTitle", report.getReport_title());
                    map.put("fileCode", report.getFileCode());
                    map.put("creationDate", report.getCreationDate());
                    map.put("status", report.getStatus());
                    map.put("profFirstName", userRepository.findByEmail(report.getUser().getProfessor_email()).getFirstName());
                    map.put("profLastName", userRepository.findByEmail(report.getUser().getProfessor_email()).getLastName());

                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }  /**
     * Get a specific report submitted to a professor as PDF.
     */
    @PostMapping("/prof/pdf")
    public ResponseEntity<?> getReportPdfForProfessor(@RequestBody GetProfessorFilesDto request) throws IOException, GeneralSecurityException {
        Report matchedReport = userRepository.findAll().stream()
                .filter(user -> request.getProfessorEmail().equalsIgnoreCase(user.getProfessor_email()))
                .flatMap(user -> user.getFiles().stream())
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

    @PostMapping("/prof/all/status/{status}")
    public ResponseEntity<List<Map<String, Object>>> getAllPendingReportsForProfessor(@RequestBody GetProfessorFilesDto request, @PathVariable String status) {
        List<Map<String, Object>> responses = userRepository.findAll().stream()
                .filter(user -> request.getProfessorEmail().equalsIgnoreCase(user.getProfessor_email()))
                .flatMap(user -> user.getFiles().stream())
                .filter(f -> f instanceof Report)
                .map(f -> (Report) f)
                .filter(r -> r.getStatus().equalsIgnoreCase(status)) // Filter by status
                .map(report -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("raFirstName", report.getUser().getFirstName());
                    map.put("raLastName", report.getUser().getLastName());
                    map.put("reportTitle", report.getReport_title());
                    map.put("fileCode", report.getFileCode());
                    map.put("creationDate", report.getCreationDate());
                    map.put("status", report.getStatus());

                    User professor = userRepository.findByEmail(report.getUser().getProfessor_email());
                    if (professor != null) {
                        map.put("profFirstName", professor.getFirstName());
                        map.put("profLastName", professor.getLastName());
                    } else {
                        map.put("profFirstName", "N/A"); // Or handle it as you see fit
                        map.put("profLastName", "N/A");
                    }
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/update-status")
    public ResponseEntity<?> updateReportStatus(@RequestBody UpdateStatusDto request) {
        // Find report by professor email and report title
        Report matchedReport = userRepository.findAll().stream()
                .filter(user -> request.getProfessorEmail().equalsIgnoreCase(user.getProfessor_email()))
                .flatMap(user -> user.getFiles().stream())
                .filter(f -> f instanceof Report)
                .map(f -> (Report) f)
                .filter(r -> r.getReport_title().equalsIgnoreCase(request.getReportTitle()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Report not found for professor: " + request.getProfessorEmail()));

        // Update status
        matchedReport.setStatus(request.getNewStatus());

        // Save user back (to persist file changes)
        userRepository.save(matchedReport.getUser());

        return ResponseEntity.ok("Status updated successfully to: " + request.getNewStatus());
    }

    /**
     * Get all files submitted by a specific RA (Research Assistant) by email.
     */
}
