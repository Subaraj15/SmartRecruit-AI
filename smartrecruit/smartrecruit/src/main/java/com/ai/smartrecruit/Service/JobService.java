////package com.ai.smartrecruit.Service;
////
////import com.ai.smartrecruit.Model.Job;
////import com.ai.smartrecruit.Model.User;
////import com.ai.smartrecruit.Repository.JobRepository;
////import com.ai.smartrecruit.Repository.UserRepository;
////
////import org.springframework.stereotype.Service;
////
////import java.util.List;
////
////@Service
////public class JobService {
////
////    private final JobRepository jobRepository;
////
////    private final UserRepository userRepository;
////
////
////    public JobService(
////            JobRepository jobRepository,
////            UserRepository userRepository) {
////
////        this.jobRepository = jobRepository;
////        this.userRepository = userRepository;
////    }
////
////
////    // =========================
////    // CREATE JOB
////    // =========================
////
////    public Job createJob(Job job) {
////
////        if (job.getRecruiter() != null &&
////                job.getRecruiter().getId() != null) {
////
////            Long recruiterId =
////                    job.getRecruiter().getId();
////
////            User recruiter =
////                    userRepository.findById(recruiterId)
////                            .orElseThrow(() ->
////                                    new RuntimeException(
////                                            "Recruiter not found"
////                                    )
////                            );
////
////            job.setRecruiter(recruiter);
////        }
////
////        return jobRepository.save(job);
////    }
////
////
////    // =========================
////    // GET ALL JOBS
////    // =========================
////
//////    public List<Job> getAllJobs() {
//////
//////        return jobRepository.findAll();
//////    }
////
////    public List<Job> getJobsByRecruiter(Long recruiterId) {
////        return jobRepository.findByRecruiter_Id(recruiterId);
////    }
////
////
////    // =========================
////    // GET JOB BY ID
////    // =========================
////
////    public Job getJobById(Long id) {
////
////        return jobRepository
////                .findById(id)
////                .orElse(null);
////    }
////
////
////    // =========================
////    // UPDATE JOB
////    // =========================
////
////    public Job updateJob(
////            Long id,
////            Job job) {
////
////        return jobRepository.findById(id)
////                .map(existingJob -> {
////
////                    existingJob.setTitle(
////                            job.getTitle()
////                    );
////
////                    existingJob.setDescription(
////                            job.getDescription()
////                    );
////
////                    existingJob.setRequiredSkills(
////                            job.getRequiredSkills()
////                    );
////
////                    existingJob.setExperience(
////                            job.getExperience()
////                    );
////
////
////                    // Update recruiter if supplied
////                    if (job.getRecruiter() != null &&
////                            job.getRecruiter().getId() != null) {
////
////                        User recruiter =
////                                userRepository
////                                        .findById(
////                                                job.getRecruiter().getId()
////                                        )
////                                        .orElseThrow(() ->
////                                                new RuntimeException(
////                                                        "Recruiter not found"
////                                                )
////                                        );
////
////                        existingJob.setRecruiter(
////                                recruiter
////                        );
////                    }
////
////
////                    return jobRepository.save(
////                            existingJob
////                    );
////                })
////                .orElse(null);
////    }
////
////
////    // =========================
////    // DELETE JOB
////    // =========================
////
////    public String deleteJob(Long id) {
////
////        if (jobRepository.existsById(id)) {
////
////            jobRepository.deleteById(id);
////
////            return "Job deleted successfully";
////        }
////
////        return "Job not found";
////    }
////}
//
//
//package com.ai.smartrecruit.Service;
//
//import com.ai.smartrecruit.Model.Job;
//import com.ai.smartrecruit.Model.User;
//import com.ai.smartrecruit.Repository.JobRepository;
//import com.ai.smartrecruit.Repository.UserRepository;
//
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class JobService {
//
//    private final JobRepository jobRepository;
//    private final UserRepository userRepository;
//
//    public JobService(
//            JobRepository jobRepository,
//            UserRepository userRepository) {
//
//        this.jobRepository = jobRepository;
//        this.userRepository = userRepository;
//    }
//
//    // =========================
//    // CREATE JOB
//    // =========================
//
//    public Job createJob(Job job) {
//
//        if (job.getRecruiter() != null &&
//                job.getRecruiter().getId() != null) {
//
//            Long recruiterId = job.getRecruiter().getId();
//
//            User recruiter = userRepository.findById(recruiterId)
//                    .orElseThrow(() ->
//                            new RuntimeException("Recruiter not found")
//                    );
//
//            job.setRecruiter(recruiter);
//        }
//
//        return jobRepository.save(job);
//    }
//
//    // =========================
//    // GET ALL JOBS
//    // =========================
//
//    public List<Job> getAllJobs() {
//
//        return jobRepository.findAll();
//    }
//
//    // =========================
//    // GET JOBS BY RECRUITER ID
//    // =========================
//
//    public List<Job> getJobsByRecruiter(Long recruiterId) {
//
//        return jobRepository.findByRecruiter_Id(recruiterId);
//    }
//
//    // =========================
//    // GET JOBS BY LOGGED-IN RECRUITER EMAIL
//    // =========================
//
//    public List<Job> getJobsByRecruiterEmail(String email) {
//
//        User recruiter = userRepository.findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException("Recruiter not found")
//                );
//
//        if (!"RECRUITER".equalsIgnoreCase(recruiter.getRole())) {
//            throw new RuntimeException("User is not a recruiter");
//        }
//
//        return jobRepository.findByRecruiter_Id(recruiter.getId());
//    }
//
//    // =========================
//    // GET JOB BY ID
//    // =========================
//
//    public Job getJobById(Long id) {
//
//        return jobRepository.findById(id).orElse(null);
//    }
//
//    // =========================
//    // UPDATE JOB
//    // =========================
//
//    public Job updateJob(Long id, Job job) {
//
//        return jobRepository.findById(id)
//                .map(existingJob -> {
//
//                    existingJob.setTitle(job.getTitle());
//                    existingJob.setDescription(job.getDescription());
//                    existingJob.setRequiredSkills(job.getRequiredSkills());
//                    existingJob.setExperience(job.getExperience());
//
//                    if (job.getRecruiter() != null &&
//                            job.getRecruiter().getId() != null) {
//
//                        User recruiter = userRepository.findById(
//                                job.getRecruiter().getId()
//                        ).orElseThrow(() ->
//                                new RuntimeException("Recruiter not found")
//                        );
//
//                        existingJob.setRecruiter(recruiter);
//                    }
//
//                    return jobRepository.save(existingJob);
//                })
//                .orElse(null);
//    }
//
//    // =========================
//    // DELETE JOB
//    // =========================
//
//    public String deleteJob(Long id) {
//
//        if (jobRepository.existsById(id)) {
//
//            jobRepository.deleteById(id);
//
//            return "Job deleted successfully";
//        }
//
//        return "Job not found";
//    }
//}





package com.ai.smartrecruit.Service;

import com.ai.smartrecruit.Model.Job;
import com.ai.smartrecruit.Model.User;

import com.ai.smartrecruit.Repository.JobRepository;
import com.ai.smartrecruit.Repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // FIND USER BY EMAIL
    // =========================

    private User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    // =========================
    // CREATE JOB FOR RECRUITER
    // =========================

    public Job createJob(Job job, String email) {

        User recruiter = getUserByEmail(email);

        if (!"RECRUITER".equalsIgnoreCase(recruiter.getRole())) {
            throw new RuntimeException(
                    "Only recruiters can post jobs"
            );
        }

        job.setRecruiter(recruiter);

        return jobRepository.save(job);
    }

    // =========================
    // GET ALL JOBS
    // =========================

    public List<Job> getAllJobs() {

        return jobRepository.findAll();
    }

    // =========================
    // GET JOBS BY RECRUITER ID
    // =========================

    public List<Job> getJobsByRecruiter(Long recruiterId) {

        return jobRepository.findByRecruiter_Id(recruiterId);
    }

    // =========================
    // GET JOBS BY LOGGED-IN RECRUITER
    // =========================

    public List<Job> getJobsByRecruiterEmail(String email) {

        User recruiter = getUserByEmail(email);

        if (!"RECRUITER".equalsIgnoreCase(recruiter.getRole())) {
            throw new RuntimeException(
                    "User is not a recruiter"
            );
        }

        return jobRepository.findByRecruiter_Id(recruiter.getId());
    }

    // =========================
    // GET JOB BY ID
    // =========================

    public Job getJobById(Long id) {

        return jobRepository.findById(id).orElse(null);
    }

    // =========================
    // UPDATE OWN JOB
    // =========================

    public Job updateJob(
            Long id,
            Job job,
            String email) {

        User recruiter = getUserByEmail(email);

        if (!"RECRUITER".equalsIgnoreCase(recruiter.getRole())) {
            throw new RuntimeException(
                    "Only recruiters can update jobs"
            );
        }

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        if (existingJob.getRecruiter() == null ||
                !existingJob.getRecruiter().getId()
                        .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You cannot update another recruiter's job"
            );
        }

        existingJob.setTitle(job.getTitle());
        existingJob.setDescription(job.getDescription());
        existingJob.setRequiredSkills(job.getRequiredSkills());
        existingJob.setExperience(job.getExperience());

        return jobRepository.save(existingJob);
    }

    // =========================
    // DELETE OWN JOB
    // =========================

    public String deleteJob(Long id, String email) {

        User recruiter = getUserByEmail(email);

        if (!"RECRUITER".equalsIgnoreCase(recruiter.getRole())) {
            throw new RuntimeException(
                    "Only recruiters can delete jobs"
            );
        }

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        if (job.getRecruiter() == null ||
                !job.getRecruiter().getId()
                        .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You cannot delete another recruiter's job"
            );
        }

        jobRepository.delete(job);

        return "Job deleted successfully";
    }
}

