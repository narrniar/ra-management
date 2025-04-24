package com.example.ra.web.Controllers;

import com.example.ra.web.Services.reportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/generate")
public class reportController {

    private final reportService reportService;

    @PostMapping("/report")
    public void generateForma1(@RequestBody Map<String, ?> requestBody, HttpServletResponse response) throws IOException {


        reportService.generateReport(requestBody, response);

    }

}
