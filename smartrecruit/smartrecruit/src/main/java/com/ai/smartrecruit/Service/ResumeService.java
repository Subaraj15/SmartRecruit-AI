//package com.ai.smartrecruit.Service;
//
//import com.ai.smartrecruit.Model.Resume;
//import com.ai.smartrecruit.Repository.ResumeRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//@Service
//public class ResumeService {
//
//    private final ResumeRepository resumeRepository;
//
//    public ResumeService(ResumeRepository resumeRepository) {
//        this.resumeRepository = resumeRepository;
//    }
//
//    // ============================
//    // UPLOAD RESUME
//    // ============================
//
//    public Resume uploadResume(Long candidateId, MultipartFile file)
//            throws IOException {
//
//        if (file == null || file.isEmpty()) {
//            throw new RuntimeException("Please select a resume file");
//        }
//
//        Resume resume = new Resume();
//
//        resume.setCandidateId(candidateId);
//
//        resume.setFileName(file.getOriginalFilename());
//
//        resume.setContentType(file.getContentType());
//
//        resume.setFileData(file.getBytes());
//
//        /*
//         * Resume text extraction will be added later.
//         * For now, we are only storing the uploaded file.
//         */
//        resume.setResumeText("");
//
//        return resumeRepository.save(resume);
//    }
//
//    // ============================
//    // GET ALL RESUMES OF CANDIDATE
//    // ============================
//
//    public List<Resume> getResumesByCandidate(Long candidateId) {
//
//        return resumeRepository.findByCandidateId(candidateId);
//    }
//
//    // ============================
//    // GET RESUME BY ID
//    // ============================
//
//    public Resume getResumeById(Long id) {
//
//        return resumeRepository.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Resume not found with id: " + id
//                        )
//                );
//    }
//
//    // ============================
//    // DELETE RESUME
//    // ============================
//
//    public void deleteResume(Long id) {
//
//        if (!resumeRepository.existsById(id)) {
//
//            throw new RuntimeException(
//                    "Resume not found with id: " + id
//            );
//        }
//
//        resumeRepository.deleteById(id);
//    }
//}

package com.ai.smartrecruit.Service;

import com.ai.smartrecruit.Model.Resume;
import com.ai.smartrecruit.Repository.ResumeRepository;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    // ==============================
    // UPLOAD RESUME
    // ==============================
    public Resume uploadResume(Long candidateId, MultipartFile file) {

        try {

            // Read PDF file
            PDDocument document = Loader.loadPDF(file.getBytes());

            // Extract text from PDF
            PDFTextStripper pdfTextStripper = new PDFTextStripper();

            String resumeText = pdfTextStripper.getText(document);

            // Close PDF document
            document.close();

            // Create Resume object
            Resume resume = new Resume();

            resume.setCandidateId(candidateId);
            resume.setFileName(file.getOriginalFilename());
            resume.setContentType(file.getContentType());
            resume.setFileData(file.getBytes());
            resume.setResumeText(resumeText);

            // Save to MySQL
            return resumeRepository.save(resume);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to upload resume: " + e.getMessage()
            );
        }
    }


    // ==============================
    // GET RESUMES BY CANDIDATE
    // ==============================
    public List<Resume> getResumesByCandidate(Long candidateId) {

        return resumeRepository.findByCandidateId(candidateId);
    }


    // ==============================
    // GET RESUME BY ID
    // ==============================
    public Resume getResumeById(Long id) {

        return resumeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found")
                );
    }


    // ==============================
    // DELETE RESUME
    // ==============================
    public void deleteResume(Long id) {

        if (!resumeRepository.existsById(id)) {

            throw new RuntimeException("Resume not found");
        }

        resumeRepository.deleteById(id);
    }
}