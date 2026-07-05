package com.shotlink.controller;

import com.shotlink.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping("/{prefix}/{filename:.+}")
    public ResponseEntity<byte[]> getFile(
            @PathVariable String prefix,
            @PathVariable String filename) {
        String objectName = prefix + "/" + filename;
        try (InputStream stream = fileStorageService.getFile(objectName)) {
            byte[] bytes = stream.readAllBytes();
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
