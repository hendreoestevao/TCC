package com.tcc.backend.controller;

import com.tcc.backend.dto.RegistroDTO;
import com.tcc.backend.dto.UpdateRegistroDTO;
import com.tcc.backend.entity.RegistroNotaFalta;
import com.tcc.backend.service.RegistroNotaFaltaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registros")
public class RegistroNotaFaltaController {

    @Autowired
    private RegistroNotaFaltaService registroNotaFaltaService;

    @PostMapping
    public ResponseEntity<RegistroNotaFalta> createRegistro(@RequestBody RegistroDTO registroDTO) {
        RegistroNotaFalta registro = registroNotaFaltaService.createRegistro(registroDTO);

        if (registro == null) {
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(registro);
    }

    @GetMapping
    public ResponseEntity<List<RegistroNotaFalta>> getAllRegistros() {
        List<RegistroNotaFalta> registros = registroNotaFaltaService.getAllRegistros();
        return ResponseEntity.ok(registros);
    }
    @PostMapping("/{disciplinaId}/registros")
    public ResponseEntity<RegistroNotaFalta> addRegistro(@PathVariable Long disciplinaId, @RequestBody RegistroNotaFalta registroNotaFalta) {
        RegistroNotaFalta createdRegistro = registroNotaFaltaService.addRegistroNotaFalta(disciplinaId, registroNotaFalta);
        return ResponseEntity.ok(createdRegistro);
    }

    @PutMapping
    public ResponseEntity<RegistroNotaFalta> updateRegistro(@RequestBody UpdateRegistroDTO updateDTO) {
        RegistroNotaFalta updatedRegistro = registroNotaFaltaService.updateRegistro(updateDTO);
        return ResponseEntity.ok(updatedRegistro);
    }


}
