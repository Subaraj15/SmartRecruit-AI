//package com.ai.smartrecruit.Model;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Setter
//@Getter
//@Entity
//@Table(name = "applications")
//public class Application {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String status;
//
//    @ManyToOne
//    @JoinColumn(name = "candidate_id")
//    private User candidate;
//
//    @ManyToOne
//    @JoinColumn(name = "job_id")
//    private Job job;
//
//    @Column(name = "match_score", nullable = false)
//    private double matchScore = 0.0;
//
//
//    // Default constructor
//    public Application() {
//    }
//
//
//    // Getters and Setters
//
//
//}

package com.ai.smartrecruit.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long candidateId;

    private long jobId;

    private long resumeId;

    private String status;

    private double matchScore;
}