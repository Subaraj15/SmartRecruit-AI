//package com.ai.smartrecruit.Service;
//
//import com.ai.smartrecruit.Model.Application;
//import com.ai.smartrecruit.Model.Match;
//import com.ai.smartrecruit.Repository.ApplicationRepository;
//import com.ai.smartrecruit.Repository.MatchRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ApplicationService {
//
//    private final ApplicationRepository applicationRepository;
//    private final MatchRepository matchRepository;
//
//    public ApplicationService(
//            ApplicationRepository applicationRepository,
//            MatchRepository matchRepository) {
//
//        this.applicationRepository = applicationRepository;
//        this.matchRepository = matchRepository;
//    }
//
//    public Application applyForJob(Long candidateId, Long jobId, Long resumeId) {
//
//        // Get the calculated match result
//        Match match = matchRepository
//                .findByJobIdAndResumeId(jobId, resumeId)
//                .orElseThrow(() ->
//                        new RuntimeException("Please calculate the resume match before applying.")
//                );
//
//        // Create application
//        Application application = new Application();
//
//        application.setCandidateId(candidateId);
//        application.setJobId(jobId);
//        application.setResumeId(resumeId);
//        application.setStatus("Applied");
//
//        // Save the actual calculated match score
//        application.setMatchScore(match.getMatchScore());
//
//        return applicationRepository.save(application);
//    }
//
//    public List<Application> getAllApplications() {
//        return applicationRepository.findAll();
//    }
//
//    public Application getApplicationById(Long id) {
//        return applicationRepository.findById(id).orElse(null);
//    }
//
//    public List<Application> getApplicationsByCandidate(Long candidateId) {
//        return applicationRepository.findByCandidateId(candidateId);
//    }
//
//    public List<Application> getApplicationsByJob(Long jobId) {
//        return applicationRepository.findByJobId(jobId);
//    }
//
//    public Application updateStatus(Long id, String status) {
//        Application application = applicationRepository.findById(id).orElse(null);
//
//        if (application == null) {
//            return null;
//        }
//
//        application.setStatus(status);
//
//        return applicationRepository.save(application);
//    }
//
//    public String deleteApplication(Long id) {
//        if (!applicationRepository.existsById(id)) {
//            return "Application not found";
//        }
//
//        applicationRepository.deleteById(id);
//
//        return "Application deleted successfully";
//    }
//}



package com.ai.smartrecruit.Service;

import com.ai.smartrecruit.Model.Application;
import com.ai.smartrecruit.Model.Match;
import com.ai.smartrecruit.Model.Job;
import com.ai.smartrecruit.Model.User;

import com.ai.smartrecruit.Repository.ApplicationRepository;
import com.ai.smartrecruit.Repository.MatchRepository;
import com.ai.smartrecruit.Repository.JobRepository;
import com.ai.smartrecruit.Repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final MatchRepository matchRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            MatchRepository matchRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.matchRepository = matchRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // APPLY FOR JOB
    public Application applyForJob(
            Long candidateId,
            Long jobId,
            Long resumeId) {

        Match match = matchRepository
                .findByJobIdAndResumeId(jobId, resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Please calculate the resume match before applying."
                        )
                );


        Application application = new Application();

        application.setCandidateId(candidateId);
        application.setJobId(jobId);
        application.setResumeId(resumeId);
        application.setStatus("Applied");
        application.setMatchScore(match.getMatchScore());

        return applicationRepository.save(application);
    }

    // GET ALL APPLICATIONS
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // GET APPLICATION BY ID
    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    // GET APPLICATIONS BY CANDIDATE
    public List<Application> getApplicationsByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    // GET APPLICATIONS BY JOB
    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    // GET APPLICATIONS FOR LOGGED-IN RECRUITER
    public List<Application> getApplicationsByRecruiterEmail(String email) {

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found")
                );

        if (!"RECRUITER".equalsIgnoreCase(recruiter.getRole())) {
            throw new RuntimeException("User is not a recruiter");
        }

        List<Job> recruiterJobs =
                jobRepository.findByRecruiter_Id(recruiter.getId());

        List<Application> recruiterApplications = new ArrayList<>();

        for (Job job : recruiterJobs) {

            List<Application> applications =
                    applicationRepository.findByJobId(job.getId());

            recruiterApplications.addAll(applications);
        }

        return recruiterApplications;
    }

    // UPDATE APPLICATION STATUS
    public Application updateStatus(Long id, String status) {

        Application application =
                applicationRepository.findById(id).orElse(null);

        if (application == null) {
            return null;
        }

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    // DELETE APPLICATION
    public String deleteApplication(Long id) {

        if (!applicationRepository.existsById(id)) {
            return "Application not found";
        }

        applicationRepository.deleteById(id);

        return "Application deleted successfully";
    }

}
