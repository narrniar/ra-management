package com.example.ra.google_drive.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Res {
    private int status;
    private String message;
    private String url;
}
