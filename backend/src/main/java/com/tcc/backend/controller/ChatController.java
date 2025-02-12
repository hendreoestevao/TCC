package com.tcc.backend.controller;

import com.tcc.backend.entity.ChatMessage;
import com.tcc.backend.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    @Autowired
    private ChatMessageService chatMessageService;

    @PostMapping
    public ChatMessage sendMessage(@RequestBody ChatMessage chatMessage) {
        return chatMessageService.saveMessage(chatMessage);
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessageWs(ChatMessage chatMessage) {
        return chatMessageService.saveMessage(chatMessage);
    }

    @GetMapping
    public List<ChatMessage> getMessages(
            @RequestParam Long studentId,
            @RequestParam Long teacherId,
            @RequestParam(required = false) String role) {

        return chatMessageService.findMessagesByStudentAndTeacherAndRole(studentId, teacherId, role);
    }


    @MessageMapping("/sendMessage/{studentId}/{teacherId}")
    @SendTo("/topic/messages/{studentId}/{teacherId}")
    public ChatMessage sendPrivateMessageWs(
            @PathVariable Long studentId,
            @PathVariable Long teacherId,
            ChatMessage chatMessage) {

        return chatMessageService.saveMessage(chatMessage);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<ChatMessage> getMessagesByTeacherId(@PathVariable Long teacherId) {
        return chatMessageService.findMessagesByTeacherId(teacherId);
    }
}
