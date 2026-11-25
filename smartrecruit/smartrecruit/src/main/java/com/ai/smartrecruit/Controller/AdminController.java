
package com.ai.smartrecruit.Controller;

import com.ai.smartrecruit.Model.User;
import com.ai.smartrecruit.Repository.UserRepository;
import com.ai.smartrecruit.Repository.JobRepository;
import com.ai.smartrecruit.Repository.ApplicationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178"
})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // Admin Dashboard Statistics
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {

        List<User> users = userRepository.findAll();

        long candidates = users.stream()
                .filter(user -> "CANDIDATE".equalsIgnoreCase(user.getRole()))
                .count();

        long recruiters = users.stream()
                .filter(user -> "RECRUITER".equalsIgnoreCase(user.getRole()))
                .count();

        return Map.of(
                "totalUsers", users.size(),
                "totalCandidates", candidates,
                "totalRecruiters", recruiters,
                "totalJobs", jobRepository.count(),
                "totalApplications", applicationRepository.count()
        );
    }

    // View All Candidates
    @GetMapping("/candidates")
    public List<User> getCandidates() {

        return userRepository.findAll().stream()
                .filter(user -> "CANDIDATE".equalsIgnoreCase(user.getRole()))
                .toList();
    }

    // View All Recruiters
    @GetMapping("/recruiters")
    public List<User> getRecruiters() {

        return userRepository.findAll().stream()
                .filter(user -> "RECRUITER".equalsIgnoreCase(user.getRole()))
                .toList();
    }

    // View All Jobs
    @GetMapping("/jobs")
    public List<com.ai.smartrecruit.Model.Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // View All Applications
    @GetMapping("/applications")
    public List<com.ai.smartrecruit.Model.Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
