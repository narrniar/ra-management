package com.example.ra.web.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestReport {

    // RA (Research Assistant)
    private String ra_firstname;
    private String ra_lastname;
    private String ra_email;

    // PA (Project Administrator)
    private String pa_firstname;
    private String pa_lastname;
    private String pa_email;

    // Project information
    private String project_name;
    private String report_type;
    private String reporting_period;
    private String description;
    private String report_title;

    // List of tasks (each task has a date, hours, description)
    private List<Task> tasks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Task {
        private String date;
        private String hours;
        private String description;
    }
}
