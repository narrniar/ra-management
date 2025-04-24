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

    public void generateReport(Map<String, ?> data, HttpServletResponse response) {



        try{

            InputStream reportStream = getClass().getClassLoader().getResourceAsStream(REPORT_TEMPLATE);
            InputStream reportChildStream = getClass().getClassLoader().getResourceAsStream(REPORT_CHILD_TEMPLATE);
            InputStream subreportStream = getClass().getClassLoader().getResourceAsStream(SUBREPORT_TEMPLATE);

            JasperReport report = JasperCompileManager.compileReport(reportStream);
            JasperReport reportChild = JasperCompileManager.compileReport(reportChildStream);
            JasperReport subreport= JasperCompileManager.compileReport(subreportStream);

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



            // Set response headers
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=Checklist.pdf");
            // Export PDF
            JasperExportManager.exportReportToPdfStream(jasperPrint, response.getOutputStream());

            response.getOutputStream().flush();


        } catch (Exception e) {
            e.printStackTrace();
            handleError(response, "Error generating report: " + e.getMessage(), e);
        }
    }

    private void handleError(HttpServletResponse response, String message, Exception e) {
        try {
            if (!response.isCommitted()) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, message);
            }
        } catch (Exception ioException) {
            ioException.printStackTrace();
        }
        e.printStackTrace();
    }
}
