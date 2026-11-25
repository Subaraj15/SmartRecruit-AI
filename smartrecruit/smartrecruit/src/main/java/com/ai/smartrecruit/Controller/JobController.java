//package com.ai.smartrecruit.Controller;
//
//import com.ai.smartrecruit.Model.Job;
//import com.ai.smartrecruit.Service.JobService;
//
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.security.Principal;
//
//@RestController
//@RequestMapping("/api/jobs")
//@CrossOrigin(origins = {
//        "http://localhost:5173",
//        "http://localhost:5174",
//        "http://localhost:5175",
//        "http://localhost:5176",
//        "http://localhost:5177",
//        "http://localhost:5178"
//})
//public class JobController {
//
//    private final JobService jobService;
//
//
//    public JobController(JobService jobService) {
//
//        this.jobService = jobService;
//    }
//
//
//    // =========================
//    // CREATE JOB
//    // =========================
//
//    @PostMapping
//    public Job createJob(
//            @RequestBody Job job) {
//
//        return jobService.createJob(job);
//    }
//
//
//    // =========================
//    // GET ALL JOBS
//    // =========================
//
////    @GetMapping
////    public List<Job> getAllJobs() {
////
////        return jobService.getAllJobs();
////    }
//
//
//    // GET JOBS POSTED BY A RECRUITER
//
//    @GetMapping("/recruiter/{recruiterId}")
//    public List<Job> getJobsByRecruiter(
//            @PathVariable Long recruiterId) {
//
//        return jobService.getJobsByRecruiter(recruiterId);
//    }
//
//
//    // =========================
//    // GET JOB BY ID
//    // =========================
//
//    @GetMapping("/{id}")
//    public Job getJobById(
//            @PathVariable Long id) {
//
//        return jobService.getJobById(id);
//    }
//
//
//    // =========================
//    // UPDATE JOB
//    // =========================
//
//    @PutMapping("/{id}")
//    public Job updateJob(
//            @PathVariable Long id,
//            @RequestBody Job job) {
//
//        return jobService.updateJob(
//                id,
//                job
//        );
//    }
//
//
//    // =========================
//    // DELETE JOB
//    // =========================
//
//    @DeleteMapping("/{id}")
//    public String deleteJob(
//            @PathVariable Long id) {
//
//        return jobService.deleteJob(id);
//    }
//
//
//    @GetMapping("/my-jobs")
//    public List<Job> getMyJobs(Principal principal) {
//
//        return jobService.getJobsByRecruiterEmail(
//                principal.getName()
//        );
//    }
//}




package com.ai.smartrecruit.Controller;

import com.ai.smartrecruit.Model.Job;
import com.ai.smartrecruit.Service.JobService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178"
})
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // CREATE JOB - LOGGED-IN RECRUITER
    @PostMapping
    public Job createJob(
            @RequestBody Job job,
            Principal principal) {

        return jobService.createJob(
                job,
                principal.getName()
        );
    }

    // GET ALL JOBS - CANDIDATE JOB SEARCH
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // GET JOBS POSTED BY LOGGED-IN RECRUITER
    @GetMapping("/my-jobs")
    public List<Job> getMyJobs(Principal principal) {

        return jobService.getJobsByRecruiterEmail(
                principal.getName()
        );
    }

    // GET JOB BY ID
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    // UPDATE OWN JOB
    @PutMapping("/{id}")
    public Job updateJob(
            @PathVariable Long id,
            @RequestBody Job job,
            Principal principal) {

        return jobService.updateJob(
                id,
                job,
                principal.getName()
        );
    }

    // DELETE OWN JOB
    @DeleteMapping("/{id}")
    public String deleteJob(
            @PathVariable Long id,
            Principal principal) {

        return jobService.deleteJob(
                id,
                principal.getName()
        );
    }
}
