package com.ai.smartrecruit.Model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class ChatbotResponse {

    private String reply;

    private List<JobMatch> jobs;

    public ChatbotResponse() {
    }

    public ChatbotResponse(
            String reply,
            List<JobMatch> jobs) {

        this.reply = reply;
        this.jobs = jobs;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<JobMatch> getJobs() {
        return jobs;
    }

    public void setJobs(List<JobMatch> jobs) {
        this.jobs = jobs;
    }

    @Setter
    @Getter
    public static class JobMatch {

        private Long id;
        private String title;
        private String description;
        private int experience;
        private String requiredSkills;
        private double matchPercentage;

        public JobMatch() {
        }

        public JobMatch(
                Long id,
                String title,
                String description,
                int experience,
                String requiredSkills,
                double matchPercentage) {

            this.id = id;
            this.title = title;
            this.description = description;
            this.experience = experience;
            this.requiredSkills = requiredSkills;
            this.matchPercentage = matchPercentage;
        }

    }
}