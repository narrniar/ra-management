package com.example.ra.persistence.models.FILE.CHILDREN;

import com.example.ra.persistence.models.FILE.File;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Contract extends File {
//    @Id
//    @GeneratedValue
//    private Long id;

    @Column(name = "contract_number", unique = true)
    private String contractNumber;
}
