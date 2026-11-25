package com.ai.smartrecruit.Controller;

import com.ai.smartrecruit.Model.Application;
import com.ai.smartrecruit.Service.ApplicationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.security.Principal;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178"})
public class ApplicationController {

    private final ApplicationService applicationService;


    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }


    // ==========================================
    // APPLY FOR JOB
    // ==========================================

    @PostMapping("/apply")
    public Application applyForJob(
            @RequestParam Long candidateId,
            @RequestParam Long jobId,
            @RequestParam Long resumeId) {

        return applicationService.applyForJob(candidateId, jobId, resumeId);
    }


    // ==========================================
    // GET ALL APPLICATIONS
    // ==========================================

    @GetMapping("/getall")
    public List<Application> getAllApplications() {

        return applicationService
                .getAllApplications();
    }


    // ==========================================
    // GET APPLICATION BY ID
    // ==========================================

    @GetMapping("/getbyid/{id}")
    public Application getApplicationById(
            @PathVariable Long id) {

        return applicationService
                .getApplicationById(id);
    }


    // ==========================================
    // GET APPLICATIONS BY CANDIDATE
    // ==========================================

    @GetMapping("/candidate/{candidateId}")
    public List<Application>
    getApplicationsByCandidate(
            @PathVariable Long candidateId) {

        return applicationService
                .getApplicationsByCandidate(
                        candidateId
                );
    }


    // ==========================================
    // GET APPLICATIONS BY JOB
    // ==========================================

    @GetMapping("/job/{jobId}")
    public List<Application>
    getApplicationsByJob(
            @PathVariable Long jobId) {

        return applicationService
                .getApplicationsByJob(jobId);
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    @PutMapping("/status/{id}")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService
                .updateStatus(id, status);
    }


    // ==========================================
    // DELETE APPLICATION
    // ==========================================

    @DeleteMapping("/delete/{id}")
    public String deleteApplication(
            @PathVariable Long id) {

        return applicationService
                .deleteApplication(id);
    }

    // ==========================================
// GET APPLICATIONS FOR LOGGED-IN RECRUITER
// ==========================================

    @GetMapping("/recruiter/my-applications")
    public List<Application> getRecruiterApplications(
            Principal principal) {

        return applicationService.getApplicationsByRecruiterEmail(
                principal.getName()
        );
    }
}