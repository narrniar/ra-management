package com.example.ra.persistence.models.FILE.CHILDREN;

import com.example.ra.persistence.models.FILE.File;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
public class Report extends File {

    private String report_title;
//    @Id
//    @GeneratedValue
//    private Long id;

}
