package com.tcc.backend.controller;

import com.tcc.backend.dto.CursoListDTO;
import com.tcc.backend.entity.Curso;
import com.tcc.backend.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @PostMapping
    public ResponseEntity<Curso> createCurso(@RequestBody Curso curso) {
        Curso createdCurso = cursoService.createCurso(curso);
        return ResponseEntity.ok(createdCurso);
    }

    @GetMapping
    public ResponseEntity<List<CursoListDTO>> listarCursos() {
        List<CursoListDTO> cursos = cursoService.listarCursos();
        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> getCursoById(@PathVariable Long id) {
        Curso curso = cursoService.getCursoById(id);
        return ResponseEntity.ok(curso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> updateCurso(@PathVariable Long id, @RequestBody Curso curso) {
        Curso updatedCurso = cursoService.updateCurso(id, curso);
        return ResponseEntity.ok(updatedCurso);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurso(@PathVariable Long id) {
        cursoService.deleteCurso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Curso>> getCursosByNome(@RequestParam String nome) {
        List<Curso> cursos = cursoService.getCursosByNome(nome);
        return ResponseEntity.ok(cursos);
    }


}
