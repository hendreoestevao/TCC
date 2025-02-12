package com.tcc.backend.controller;

import com.tcc.backend.dto.AlunoDTO;
import com.tcc.backend.dto.DisciplinaDTO;
import com.tcc.backend.dto.ProfessorDTO;
import com.tcc.backend.dto.TurmaListDTO;
import com.tcc.backend.entity.Turma;
import com.tcc.backend.entity.Curso;
import com.tcc.backend.entity.Disciplina;
import com.tcc.backend.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @PostMapping
    public ResponseEntity<Turma> createTurma(@RequestBody Turma turma) {
        Turma novaTurma = turmaService.createTurma(turma);
        return ResponseEntity.ok(novaTurma);
    }

//    @GetMapping
//    public ResponseEntity<List<Turma>> getAllTurmas(@RequestParam(required = false) String nome) {
//        if (nome != null) {
//            return ResponseEntity.ok(turmaService.getTurmasByNome(nome));
//        }
//        return ResponseEntity.ok(turmaService.getAllTurmas());
//    }

    @GetMapping
    public List<TurmaListDTO> listarTurmas() {
        return turmaService.getAllTurmas();
    }



    @GetMapping("/{id}")
    public ResponseEntity<Turma> getTurmaById(@PathVariable Long id) {
        Optional<Turma> optionalTurma = turmaService.getTurmaById(id);

        if (optionalTurma.isPresent()) {
            return ResponseEntity.ok(optionalTurma.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Turma> updateTurma(@PathVariable Long id, @RequestBody Turma turma) {
        turma.setId(id);
        Turma turmaAtualizada = turmaService.updateTurma(turma);
        return ResponseEntity.ok(turmaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTurma(@PathVariable Long id) {
        turmaService.deleteTurma(id);
        return ResponseEntity.noContent().build();
    }
}
