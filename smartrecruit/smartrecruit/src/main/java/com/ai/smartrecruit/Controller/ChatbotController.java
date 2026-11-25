package com.ai.smartrecruit.Controller;

import com.ai.smartrecruit.Model.ChatbotRequest;
import com.ai.smartrecruit.Model.ChatbotResponse;
import com.ai.smartrecruit.Service.ChatbotService;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178"
})
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ChatbotResponse chat(
            @RequestBody ChatbotRequest request) {

        System.out.println("CHATBOT CONTROLLER REACHED");

        return chatbotService.processMessage(
                request.getMessage()
        );
    }
}



