package com.example.ra.persistence.models.FILE.CHILDREN;

import com.example.ra.persistence.models.FILE.File;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
public class Contract extends File {
//    @Id
//    @GeneratedValue
//    private Long id;

    @Column(name = "contract_number", unique = true)
    private String contractNumber;
}
