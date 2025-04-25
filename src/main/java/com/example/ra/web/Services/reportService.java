package com.example.ra.web.Services;


import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRMapCollectionDataSource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
public class reportService {

    private static final String REPORT_TEMPLATE = "reports/report/report.jrxml";
    private static final String REPORT_CHILD_TEMPLATE = "reports/report/report-child.jrxml";
    private static final String SUBREPORT_TEMPLATE = "reports/subreport/subreport.jrxml";

    public java.io.File generateReport(Map<String, ?> data) {
        try {
            InputStream reportStream = getClass().getClassLoader().getResourceAsStream(REPORT_TEMPLATE);
            InputStream reportChildStream = getClass().getClassLoader().getResourceAsStream(REPORT_CHILD_TEMPLATE);
            InputStream subreportStream = getClass().getClassLoader().getResourceAsStream(SUBREPORT_TEMPLATE);

            JasperReport report = JasperCompileManager.compileReport(reportStream);
            JasperReport reportChild = JasperCompileManager.compileReport(reportChildStream);
            JasperReport subreport = JasperCompileManager.compileReport(subreportStream);

            List<JasperReport> subreportSources = new ArrayList<>();
            List<JRDataSource> subreportDataSources = new ArrayList<>();

            subreportSources.add(report);
            JRDataSource forma1DataSource = new JRMapCollectionDataSource(Collections.singletonList(data));
            subreportDataSources.add(forma1DataSource);

            List<Map<String, ?>> relatives = (List<Map<String, ?>>) data.get("tasks");
            for (var item : relatives) {
                subreportSources.add(reportChild);
                JRMapCollectionDataSource dataSource = new JRMapCollectionDataSource(Collections.singletonList(item));
                subreportDataSources.add(dataSource);
            }

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("SubreportSources", subreportSources);
            parameters.put("SubreportDataSources", subreportDataSources);

            JRDataSource dataSourceWithSize = new JREmptyDataSource(subreportSources.size());

            JasperPrint jasperPrint = JasperFillManager.fillReport(subreport, parameters, dataSourceWithSize);

            // Create temp file for PDF output
            java.io.File pdfFile = java.io.File.createTempFile("report-", ".pdf");
            JasperExportManager.exportReportToPdfFile(jasperPrint, pdfFile.getAbsolutePath());

            return pdfFile;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating report: " + e.getMessage(), e);
        }
    }

}
