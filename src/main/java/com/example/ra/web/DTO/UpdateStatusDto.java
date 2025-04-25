// File: UpdateStatusDto.java
package com.example.ra.web.DTO;

import lombok.Data;

@Data
public class UpdateStatusDto {
    private String professorEmail;
    private String reportTitle;
    private String newStatus;
}