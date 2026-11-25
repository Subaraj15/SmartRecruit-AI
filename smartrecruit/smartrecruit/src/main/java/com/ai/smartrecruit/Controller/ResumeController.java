package com.ai.smartrecruit.Controller;

import com.ai.smartrecruit.Model.Resume;
import com.ai.smartrecruit.Service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178"
})
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    // ============================
    // UPLOAD RESUME
    // ============================

    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(

            @RequestParam("candidateId") Long candidateId,

            @RequestParam("file") MultipartFile file

    ) throws IOException {

        Resume resume =
                resumeService.uploadResume(candidateId, file);

        return ResponseEntity.ok(resume);
    }

    // ============================
    // GET ALL RESUMES OF CANDIDATE
    // ============================

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Resume>> getResumesByCandidate(

            @PathVariable Long candidateId

    ) {

        List<Resume> resumes =
                resumeService.getResumesByCandidate(candidateId);

        return ResponseEntity.ok(resumes);
    }

    // ============================
    // GET RESUME BY ID
    // ============================

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(

            @PathVariable Long id

    ) {

        Resume resume =
                resumeService.getResumeById(id);

        return ResponseEntity.ok(resume);
    }

    // ============================
    // DELETE RESUME
    // ============================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(

            @PathVariable Long id

    ) {

        resumeService.deleteResume(id);

        return ResponseEntity.ok(
                "Resume deleted successfully"
        );
    }
}