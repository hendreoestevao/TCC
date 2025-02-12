package com.tcc.backend.repository;

import com.tcc.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByStudentIdAndTeacherId(Long studentId, Long teacherId);
    List<ChatMessage> findByStudentIdAndTeacherIdAndRole(Long studentId, Long teacherId, String role);
    List<ChatMessage> findByTeacherId(Long teacherId);
}
