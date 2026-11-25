////package com.ai.smartrecruit.Model;
////
////import jakarta.persistence.*;
////import lombok.AllArgsConstructor;
////import lombok.Getter;
////import lombok.NoArgsConstructor;
////import lombok.Setter;
////
////@Entity
////@Table(name = "matches")
////@NoArgsConstructor
////@AllArgsConstructor
////@Getter
////@Setter
////public class Match {
////
////    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
////    long id;
////
////    long candidateId;
////    long jobId;
////    long resumeId;
////
////    double matchScore;
////
////    @Column(length = 2000)
////    String matchedSkills;
////
////    @Column(length = 2000)
////    String missingSkills;
////}
//
//package com.ai.smartrecruit.Model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name = "matches")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class Match {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Long candidateId;
//
//    private Long jobId;
//
//    private Long resumeId;
//
//    private Double matchScore;
//}




package com.ai.smartrecruit.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "resume_id", nullable = false)
    private Long resumeId;

    @Column(name = "match_score", nullable = false)
    private Double matchScore;

    @Column(name = "matched_skills", length = 2000)
    private String matchedSkills;

    @Column(name = "missing_skills", length = 2000)
    private String missingSkills;
}