package com.ai.smartrecruit.Repository;

import com.ai.smartrecruit.Model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    Optional<Match> findByJobIdAndResumeId(Long jobId, Long resumeId);

}