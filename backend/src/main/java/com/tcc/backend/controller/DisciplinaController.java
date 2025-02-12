package com.tcc.backend.controller;

import com.tcc.backend.dto.DisciplinaDTO;
import com.tcc.backend.dto.DisciplinaListDTO;
import com.tcc.backend.entity.Disciplina;
import com.tcc.backend.service.DisciplinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @PostMapping
    public ResponseEntity<Disciplina> createDisciplina(@RequestBody Disciplina disciplina) {
        Disciplina createdDisciplina = disciplinaService.createDisciplina(disciplina);
        return ResponseEntity.ok(createdDisciplina);
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaListDTO>> getAllDisciplinas() {
        List<DisciplinaListDTO> disciplinas = disciplinaService.getAllDisciplinasAsDTO();
        return ResponseEntity.ok(disciplinas);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> getDisciplinaById(@PathVariable Long id) {
        Disciplina disciplina = disciplinaService.getDisciplinaById(id);
        return ResponseEntity.ok(disciplina);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<Disciplina> updateDisciplina(@PathVariable Long id, @RequestBody Disciplina disciplina) {
//        Disciplina updatedDisciplina = disciplinaService.updateDisciplina(id, disciplina);
//        return ResponseEntity.ok(updatedDisciplina);
//    }


    @PutMapping("/{id}")
    public ResponseEntity<DisciplinaDTO> updateDisciplina(
            @PathVariable Long id,
            @RequestBody DisciplinaDTO disciplinaDTO) {
        Disciplina updatedDisciplina = disciplinaService.updateDisciplina(id, disciplinaDTO);
        DisciplinaDTO responseDTO = disciplinaService.toDisciplinaDTO(updatedDisciplina);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisciplina(@PathVariable Long id) {
        disciplinaService.deleteDisciplina(id);
        return ResponseEntity.noContent().build();
    }
}
