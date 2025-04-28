// File: com.example.ra.web.DTO.GetProfessorFilesDto.java
package com.example.ra.web.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class GetProfessorFilesDto {
    private String professorEmail;
    private String reportTitle; // optional for PDF
}