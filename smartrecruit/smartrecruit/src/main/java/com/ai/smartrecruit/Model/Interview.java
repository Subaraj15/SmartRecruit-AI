package com.ai.smartrecruit.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "interviews")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    long candidateId;
    long jobId;

    double score;

    @Column(length = 3000)
    String feedback;
}