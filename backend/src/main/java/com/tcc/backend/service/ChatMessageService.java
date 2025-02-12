package com.tcc.backend.service;

import com.tcc.backend.entity.ChatMessage;
import com.tcc.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessages(Long studentId, Long teacherId) {
        return chatMessageRepository.findByStudentIdAndTeacherId(studentId, teacherId);
    }

    public List<ChatMessage> findMessagesByStudentAndTeacher(Long studentId, Long teacherId) {
        return chatMessageRepository.findByStudentIdAndTeacherId(studentId, teacherId);
    }

    public List<ChatMessage> findMessagesByStudentAndTeacherAndRole(Long studentId, Long teacherId, String role) {
        if (role == null) {
            return chatMessageRepository.findByStudentIdAndTeacherId(studentId, teacherId);
        } else {
            if (role.equals("student")) {
                return chatMessageRepository.findByStudentIdAndTeacherIdAndRole(studentId, teacherId, "student");
            } else if (role.equals("teacher")) {
                return chatMessageRepository.findByStudentIdAndTeacherIdAndRole(studentId, teacherId, "teacher");
            }
            return new ArrayList<>();
        }
    }

    public List<ChatMessage> findMessagesByTeacherId(Long teacherId) {
        return chatMessageRepository.findByTeacherId(teacherId);
    }

}
