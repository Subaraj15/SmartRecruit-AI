////
////package com.ai.smartrecruit.Service;
////
////import com.ai.smartrecruit.Model.ChatbotResponse;
////import com.ai.smartrecruit.Model.Job;
////import com.ai.smartrecruit.Repository.JobRepository;
////
////import com.fasterxml.jackson.databind.JsonNode;
////import com.fasterxml.jackson.databind.ObjectMapper;
////
////import org.springframework.http.MediaType;
////import org.springframework.stereotype.Service;
////import org.springframework.web.client.RestClient;
////
////import java.util.*;
////
////@Service
////public class ChatbotService {
////
////    private final JobRepository jobRepository;
////    private final ObjectMapper objectMapper;
////    private final RestClient restClient;
////
////    public ChatbotService(JobRepository jobRepository) {
////        this.jobRepository = jobRepository;
////        this.objectMapper = new ObjectMapper();
////
////        // Connect to Ollama running locally
////        this.restClient = RestClient.builder()
////                .baseUrl("http://localhost:11434")
////                .build();
////    }
////
////    public ChatbotResponse processMessage(String message) {
////        try {
////            if (message == null || message.isBlank()) {
////                return new ChatbotResponse(
////                        "Please enter your skills, experience, or preferred job title.",
////                        new ArrayList<>()
////                );
////            }
////
////            // 1. Extract candidate information using local AI
////            String prompt = """
////                    Extract information from the candidate's message.
////
////                    Return only valid JSON with these fields:
////                    {
////                      "skills": ["Java", "Spring Boot", "MySQL"],
////                      "experience": 1,
////                      "jobPreference": "Java Developer"
////                    }
////
////                    Rules:
////                    - skills must be an array of strings.
////                    - experience must be a number of years.
////                    - Use 0 if experience is not mentioned.
////                    - Use an empty array if skills are not mentioned.
////                    - Use an empty string if job preference is not mentioned.
////                    - Do not invent information.
////
////                    Candidate message:
////                    %s
////                    """.formatted(message);
////
////            Map<String, Object> requestBody = new HashMap<>();
////            requestBody.put("model", "llama3.2:1b");
////            requestBody.put("prompt", prompt);
////            requestBody.put("stream", false);
////            requestBody.put("format", "json");
////
////            Map<?, ?> response = restClient.post()
////                    .uri("/api/generate")
////                    .contentType(MediaType.APPLICATION_JSON)
////                    .body(requestBody)
////                    .retrieve()
////                    .body(Map.class);
////
////            if (response == null || response.get("response") == null) {
////                throw new IllegalStateException(
////                        "Ollama returned an empty response"
////                );
////            }
////
////            String aiText = response.get("response").toString();
////            JsonNode aiData = objectMapper.readTree(aiText);
////
////            // 2. Read candidate skills
////            List<String> candidateSkills = new ArrayList<>();
////            JsonNode skillsNode = aiData.get("skills");
////
////            if (skillsNode != null && skillsNode.isArray()) {
////                for (JsonNode skill : skillsNode) {
////                    String value = skill.asText().trim();
////
////                    if (!value.isEmpty()) {
////                        candidateSkills.add(value);
////                    }
////                }
////            }
////
////            int candidateExperience = aiData.has("experience")
////                    ? Math.max(0, aiData.get("experience").asInt())
////                    : 0;
////
////            String jobPreference = aiData.has("jobPreference")
////                    ? aiData.get("jobPreference").asText().trim()
////                    : "";
////
////            // 3. Get jobs from MySQL
////            List<Job> jobs = jobRepository.findAll();
////            List<ChatbotResponse.JobMatch> matches = new ArrayList<>();
////
////            // 4. Match candidate skills with required job skills
////            for (Job job : jobs) {
////                String requiredSkills = job.getRequiredSkills();
////
////                if (requiredSkills == null || requiredSkills.isBlank()) {
////                    continue;
////                }
////
////                if (candidateSkills.isEmpty()) {
////                    continue;
////                }
////
////                Set<String> jobSkillSet = new HashSet<>();
////
////                for (String skill : requiredSkills.split(",")) {
////                    String normalized = normalize(skill);
////
////                    if (!normalized.isEmpty()) {
////                        jobSkillSet.add(normalized);
////                    }
////                }
////
////                int matchedSkills = 0;
////
////                for (String candidateSkill : candidateSkills) {
////                    String normalizedCandidate = normalize(candidateSkill);
////
////                    if (jobSkillSet.contains(normalizedCandidate)) {
////                        matchedSkills++;
////                    }
////                }
////
////                // Percentage of required job skills that match
////                double skillMatch = jobSkillSet.isEmpty()
////                        ? 0
////                        : Math.min(
////                        100,
////                        ((double) matchedSkills / jobSkillSet.size()) * 100
////                );
////
////                // Experience score
////                double experienceMatch = 100;
////
////                if (job.getExperience() > candidateExperience) {
////                    experienceMatch = 50;
////                }
////
////                // Job title score
////                String title = normalize(job.getTitle());
////                String preference = normalize(jobPreference);
////
////                double titleMatch = 0;
////
////                if (!preference.isEmpty() && !title.isEmpty()) {
////                    if (title.contains(preference)
////                            || preference.contains(title)) {
////                        titleMatch = 100;
////                    } else {
////                        String[] words = jobPreference
////                                .toLowerCase(Locale.ROOT)
////                                .split("\\s+");
////
////                        for (String word : words) {
////                            String normalizedWord = normalize(word);
////
////                            if (normalizedWord.length() > 2
////                                    && title.contains(normalizedWord)) {
////                                titleMatch = 100;
////                                break;
////                            }
////                        }
////                    }
////                }
////
////                // Final score: skills 70%, experience 20%, title 10%
////                double finalScore =
////                        (skillMatch * 0.70)
////                                + (experienceMatch * 0.20)
////                                + (titleMatch * 0.10);
////
////                if (finalScore >= 30) {
////                    matches.add(new ChatbotResponse.JobMatch(
////                            job.getId(),
////                            job.getTitle(),
////                            job.getDescription(),
////                            job.getExperience(),
////                            job.getRequiredSkills(),
////                            Math.round(finalScore * 100) / 100.0
////                    ));
////                }
////            }
////
////            // 5. Sort by highest match score
////            matches.sort(
////                    Comparator.comparingDouble(
////                            ChatbotResponse.JobMatch::getMatchPercentage
////                    ).reversed()
////            );
////
////            // Return at most five matches
////            if (matches.size() > 5) {
////                matches = new ArrayList<>(matches.subList(0, 5));
////            }
////
////            String reply;
////
////            if (matches.isEmpty()) {
////                reply = "I couldn't find a suitable job based on your skills. "
////                        + "Try mentioning your skills, experience, "
////                        + "or preferred job title.";
////            } else {
////                reply = "I found " + matches.size()
////                        + " job(s) that match your profile.";
////            }
////
////            return new ChatbotResponse(reply, matches);
////
////        } catch (Exception e) {
////            // Avoid logging candidate messages or secrets
////            System.err.println(
////                    "Chatbot processing failed: "
////                            + e.getClass().getSimpleName()
////            );
////
////            return new ChatbotResponse(
////                    "Sorry, I couldn't process your request. "
////                            + "Please check that Ollama is running "
////                            + "and try again.",
////                    new ArrayList<>()
////            );
////        }
////    }
////
////    // Normalize skills and titles for comparison
////    private String normalize(String value) {
////        if (value == null) {
////            return "";
////        }
////
////        return value.toLowerCase(Locale.ROOT)
////                .replaceAll("[^a-z0-9]", "");
////    }
////}
//
//
//
//package com.ai.smartrecruit.Service;
//
//import com.ai.smartrecruit.Model.ChatbotResponse;
//import com.ai.smartrecruit.Model.Job;
//import com.ai.smartrecruit.Repository.JobRepository;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClient;
//
//import java.util.*;
//
//@Service
//public class ChatbotService {
//
//    private final JobRepository jobRepository;
//    private final ObjectMapper objectMapper;
//    private final RestClient restClient;
//
//    public ChatbotService(JobRepository jobRepository) {
//        this.jobRepository = jobRepository;
//        this.objectMapper = new ObjectMapper();
//
//        // Connect to Ollama running locally
//        this.restClient = RestClient.builder()
//                .baseUrl("http://localhost:11434")
//                .build();
//    }
//
//    public ChatbotResponse processMessage(String message) {
//        try {
//            if (message == null || message.isBlank()) {
//                return new ChatbotResponse(
//                        "Please enter your skills, experience, or preferred job title.",
//                        new ArrayList<>()
//                );
//            }
//
//            // 1. Extract candidate information using Ollama
//            String prompt = """
//                    Extract information from the candidate's message.
//
//                    Return only valid JSON with these fields:
//                    {
//                      "skills": ["Java", "Spring Boot", "MySQL"],
//                      "experience": 1,
//                      "jobPreference": "Java Developer"
//                    }
//
//                    Rules:
//                    - Skills must be an array of strings.
//                    - Include only skills explicitly mentioned.
//                    - Experience must be a number of years.
//                    - Use 0 if experience is not mentioned.
//                    - Use an empty array if skills are not mentioned.
//                    - Use an empty string if job preference is not mentioned.
//                    - Do not invent information.
//                    - Preserve the requested job role accurately.
//
//                    Candidate message:
//                    %s
//                    """.formatted(message);
//
//            Map<String, Object> requestBody = new HashMap<>();
//            requestBody.put("model", "llama3.2:1b");
//            requestBody.put("prompt", prompt);
//            requestBody.put("stream", false);
//            requestBody.put("format", "json");
//
//            Map<?, ?> response = restClient.post()
//                    .uri("/api/generate")
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .body(requestBody)
//                    .retrieve()
//                    .body(Map.class);
//
//            if (response == null || response.get("response") == null) {
//                throw new IllegalStateException(
//                        "Ollama returned an empty response"
//                );
//            }
//
//            String aiText = response.get("response").toString();
//            JsonNode aiData = objectMapper.readTree(aiText);
//
//            // 2. Read candidate skills
//            List<String> candidateSkills = new ArrayList<>();
//            JsonNode skillsNode = aiData.get("skills");
//
//            if (skillsNode != null && skillsNode.isArray()) {
//                for (JsonNode skill : skillsNode) {
//                    String value = skill.asText().trim();
//
//                    if (!value.isEmpty()) {
//                        candidateSkills.add(value);
//                    }
//                }
//            }
//
//            int candidateExperience = aiData.has("experience")
//                    ? Math.max(0, aiData.get("experience").asInt())
//                    : 0;
//
//            String jobPreference = aiData.has("jobPreference")
//                    ? aiData.get("jobPreference").asText().trim()
//                    : "";
//
//            // 3. Get jobs from MySQL
//            List<Job> jobs = jobRepository.findAll();
//            List<ChatbotResponse.JobMatch> matches = new ArrayList<>();
//
//            // 4. Match candidate skills and job titles
//            for (Job job : jobs) {
//                String requiredSkills = job.getRequiredSkills();
//
//                if (requiredSkills == null || requiredSkills.isBlank()) {
//                    continue;
//                }
//
//                if (candidateSkills.isEmpty()) {
//                    continue;
//                }
//
//                // Normalize required job skills
//                Set<String> jobSkillSet = new HashSet<>();
//
//                for (String skill : requiredSkills.split(",")) {
//                    String normalized = normalize(skill);
//
//                    if (!normalized.isEmpty()) {
//                        jobSkillSet.add(normalized);
//                    }
//                }
//
//                if (jobSkillSet.isEmpty()) {
//                    continue;
//                }
//
//                // Count matching skills only once
//                Set<String> matchedSkillSet = new HashSet<>();
//
//                for (String candidateSkill : candidateSkills) {
//                    String normalizedCandidate = normalize(candidateSkill);
//
//                    if (jobSkillSet.contains(normalizedCandidate)) {
//                        matchedSkillSet.add(normalizedCandidate);
//                    }
//                }
//
//                int matchedSkills = matchedSkillSet.size();
//
//                // Percentage of job requirements matched
//                double skillMatch =
//                        ((double) matchedSkills / jobSkillSet.size()) * 100;
//
//                // Experience score
//                double experienceMatch = 100;
//
//                if (job.getExperience() > candidateExperience) {
//                    experienceMatch = 50;
//                }
//
//                // Job title score
//                String title = normalize(job.getTitle());
//                String preference = normalize(jobPreference);
//
//                double titleMatch = 0;
//
//                if (!preference.isEmpty() && !title.isEmpty()) {
//                    if (title.contains(preference)
//                            || preference.contains(title)) {
//                        titleMatch = 100;
//                    } else {
//                        String[] words = jobPreference
//                                .toLowerCase(Locale.ROOT)
//                                .split("\\s+");
//
//                        int matchedWords = 0;
//                        int totalWords = 0;
//
//                        for (String word : words) {
//                            String normalizedWord = normalize(word);
//
//                            if (normalizedWord.length() > 2) {
//                                totalWords++;
//
//                                if (title.contains(normalizedWord)) {
//                                    matchedWords++;
//                                }
//                            }
//                        }
//
//                        if (totalWords > 0) {
//                            titleMatch =
//                                    ((double) matchedWords / totalWords) * 100;
//                        }
//                    }
//                }
//
//                // Final score:
//                // Skills 70%, experience 20%, title 10%
//                double finalScore =
//                        (skillMatch * 0.70)
//                                + (experienceMatch * 0.20)
//                                + (titleMatch * 0.10);
//
//                // Exclude jobs with no matching skills
//                if (matchedSkills == 0) {
//                    continue;
//                }
//
//                // Exclude low-scoring jobs
//                if (finalScore < 40) {
//                    continue;
//                }
//
//                matches.add(new ChatbotResponse.JobMatch(
//                        job.getId(),
//                        job.getTitle(),
//                        job.getDescription(),
//                        job.getExperience(),
//                        job.getRequiredSkills(),
//                        Math.round(finalScore * 100) / 100.0
//                ));
//            }
//
//            // 5. Sort by highest match score
//            matches.sort(
//                    Comparator.comparingDouble(
//                            ChatbotResponse.JobMatch::getMatchPercentage
//                    ).reversed()
//            );
//
//            // 6. Return at most five matches
//            if (matches.size() > 5) {
//                matches = new ArrayList<>(matches.subList(0, 5));
//            }
//
//            // 7. Build chatbot response
//            String reply;
//
//            if (matches.isEmpty()) {
//                reply = "I couldn't find a suitable job matching your skills. "
//                        + "Try adding more technical skills or experience.";
//            } else {
//                reply = "I found " + matches.size()
//                        + " job(s) that match your profile.";
//            }
//
//            return new ChatbotResponse(reply, matches);
//
//        } catch (Exception e) {
//            // Avoid logging candidate messages or secrets
//            System.err.println(
//                    "Chatbot processing failed: "
//                            + e.getClass().getSimpleName()
//            );
//
//            return new ChatbotResponse(
//                    "Sorry, I couldn't process your request. "
//                            + "Please check that Ollama is running "
//                            + "and try again.",
//                    new ArrayList<>()
//            );
//        }
//    }
//
//    // Normalize skills and titles for comparison
//    private String normalize(String value) {
//        if (value == null) {
//            return "";
//        }
//
//        return value.toLowerCase(Locale.ROOT)
//                .replaceAll("[^a-z0-9]", "");
//    }
//}



package com.ai.smartrecruit.Service;

import com.ai.smartrecruit.Model.ChatbotResponse;
import com.ai.smartrecruit.Model.Job;
import com.ai.smartrecruit.Repository.JobRepository;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatbotService {

    private final JobRepository jobRepository;

    public ChatbotService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public ChatbotResponse processMessage(String message) {

        if (message == null || message.isBlank()) {
            return new ChatbotResponse(
                    "Please enter your skills or preferred job role.",
                    new ArrayList<>()
            );
        }

        try {
            // 1. Get jobs from database
            List<Job> jobs = jobRepository.findAll();

            // 2. Build skill list from database and common skills
            Set<String> skillCatalog = new HashSet<>();

            String[] commonSkills = {
                    "Java", "Python", "JavaScript", "TypeScript",
                    "React", "Angular", "Vue",
                    "Spring Boot", "Spring", "Hibernate",
                    "MySQL", "PostgreSQL", "MongoDB", "SQL",
                    "HTML", "CSS", "Node.js", "Express",
                    "Django", "Flask", "FastAPI",
                    "C", "C++", "C#", ".NET",
                    "AWS", "Azure", "Docker", "Kubernetes",
                    "Git", "GitHub",
                    "Machine Learning", "Artificial Intelligence",
                    "Data Science", "Data Analysis",
                    "Excel", "Power BI",
                    "PHP", "Laravel", "REST API",
                    "Jenkins", "Linux", "Figma"
            };

            for (String skill : commonSkills) {
                skillCatalog.add(skill);
            }

            // Add skills from existing jobs
            for (Job job : jobs) {
                if (job.getRequiredSkills() != null) {
                    for (String skill : job.getRequiredSkills().split(",")) {
                        if (!skill.trim().isEmpty()) {
                            skillCatalog.add(skill.trim());
                        }
                    }
                }
            }

            // 3. Extract only skills actually mentioned in message
            String normalizedMessage = normalize(message);

            Set<String> candidateSkills = new HashSet<>();

            for (String skill : skillCatalog) {

                String normalizedSkill = normalize(skill);

                if (!normalizedSkill.isEmpty()
                        && normalizedMessage.contains(normalizedSkill)) {

                    candidateSkills.add(normalizedSkill);
                }
            }

            // Handle common skill variations
            if (normalizedMessage.contains("springboot")) {
                candidateSkills.add("springboot");
            }

            if (normalizedMessage.contains("javascript")) {
                candidateSkills.add("javascript");
            }

            if (normalizedMessage.contains("nodejs")) {
                candidateSkills.add("nodejs");
            }

            if (normalizedMessage.contains("cplusplus")) {
                candidateSkills.add("cplusplus");
            }

            if (normalizedMessage.contains("csharp")) {
                candidateSkills.add("csharp");
            }

            // No skills detected
            if (candidateSkills.isEmpty()) {
                return new ChatbotResponse(
                        "I couldn't identify any technical skills in your message. "
                                + "Please mention skills like Python, Java, React, "
                                + "MySQL or Spring Boot.",
                        new ArrayList<>()
                );
            }

            // 4. Match skills against jobs
            List<ChatbotResponse.JobMatch> matches = new ArrayList<>();

            for (Job job : jobs) {

                String requiredSkills = job.getRequiredSkills();

                if (requiredSkills == null || requiredSkills.isBlank()) {
                    continue;
                }

                Set<String> jobSkillSet = new HashSet<>();

                for (String skill : requiredSkills.split(",")) {

                    String normalizedSkill = normalize(skill);

                    if (!normalizedSkill.isEmpty()) {
                        jobSkillSet.add(normalizedSkill);
                    }
                }

                if (jobSkillSet.isEmpty()) {
                    continue;
                }

                // Find matching skills
                Set<String> matchedSkills = new HashSet<>();

                for (String requiredSkill : jobSkillSet) {

                    for (String candidateSkill : candidateSkills) {

                        if (requiredSkill.equals(candidateSkill)) {
                            matchedSkills.add(requiredSkill);
                            break;
                        }
                    }
                }

                // Ignore jobs with no matching skills
                if (matchedSkills.isEmpty()) {
                    continue;
                }

                // Calculate skill match percentage
                double matchPercentage =
                        ((double) matchedSkills.size()
                                / jobSkillSet.size()) * 100;

                matchPercentage = Math.round(matchPercentage * 100.0) / 100.0;

                matches.add(new ChatbotResponse.JobMatch(
                        job.getId(),
                        job.getTitle(),
                        job.getDescription(),
                        job.getExperience(),
                        job.getRequiredSkills(),
                        matchPercentage
                ));
            }

            // 5. Sort by highest skill match
            matches.sort(
                    Comparator.comparingDouble(
                            ChatbotResponse.JobMatch::getMatchPercentage
                    ).reversed()
            );

            // 6. Return at most five jobs
            if (matches.size() > 5) {
                matches = new ArrayList<>(matches.subList(0, 5));
            }

            // 7. Build response
            String reply;

            if (matches.isEmpty()) {
                reply = "I couldn't find jobs matching your skills: "
                        + String.join(", ", candidateSkills)
                        + ". Try adding more skills.";
            } else {
                reply = "I found " + matches.size()
                        + " job(s) matching your skills: "
                        + String.join(", ", candidateSkills) + ".";
            }

            return new ChatbotResponse(reply, matches);

        } catch (Exception e) {

            System.err.println(
                    "Chatbot processing failed: "
                            + e.getClass().getSimpleName()
            );

            return new ChatbotResponse(
                    "Sorry, something went wrong while searching for jobs.",
                    new ArrayList<>()
            );
        }
    }

    // Normalize skills to make comparisons consistent
    private String normalize(String value) {

        if (value == null) {
            return "";
        }

        return value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");
    }
}
