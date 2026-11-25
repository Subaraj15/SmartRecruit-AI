
package com.ai.smartrecruit.Controller;

import com.ai.smartrecruit.Model.Match;
import com.ai.smartrecruit.Service.MatchService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178"
})
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping("/calculate")
    public Match calculateMatch(
            @RequestParam Long jobId,
            @RequestParam Long resumeId) {

        System.out.println(">>> MATCH API REACHED");
        System.out.println(">>> jobId = " + jobId
                + ", resumeId = " + resumeId);

        Match result = matchService.calculateMatch(
                jobId, resumeId
        );

        System.out.println(">>> MATCH CALCULATION FINISHED");

        return result;
    }
}
