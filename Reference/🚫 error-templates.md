# 🚫 Error Templates Reference
_Only when writing error states_
_Last updated: 11 Sept 2025_

## Standard Error Messages

### System Errors
**General Error (Screen/Toast)**
```
Title: Terdapat Kendala Sistem
Subtitle: Silakan coba beberapa saat lagi.
```

**Connection Error (Screen/Toast)**
```
Title: Terdapat Gangguan Koneksi  
Subtitle: Periksa kembali koneksi internetmu dan muat ulang dalam beberapa saat.
```

### HTTP Errors
**404 Not Found**
```
Title: Halaman Tidak Ditemukan
Subtitle: Halaman ini sedang tidak dapat diakses. Silakan kembali ke beranda untuk eksplorasi materi lainnya.
CTA: [Kembali ke Beranda]
```

**403 Forbidden**
```
Title: Terdapat Kendala Sistem
Subtitle: Silakan muat ulang dalam beberapa saat.
```

### Authentication Errors
**Session Expired**
```
Toast: Sesi telah berakhir. Silakan masuk lagi ke akunmu untuk melanjutkan.
```

### Search/Content Errors
**No Search Results**
```
Title: Tidak Ada Hasil yang Sesuai
Subtitle: Coba periksa kembali ejaanmu atau gunakan kata kunci lain.
```

**Content Under Development**
```
Title: Sedang dalam Pengembangan
Subtitle: Materi untuk mata pelajaran ini sedang dalam tahap pengembangan dan akan segera tersedia dalam waktu dekat.
```

### Loading Errors
**Large File Loading**
```
Title: Dokumen Sedang Dimuat
Subtitle: Kami membutuhkan waktu untuk memuat dokumen dengan ukuran besar. Mohon tunggu sebentar.
Helper: Tips: Pastikan koneksi internet stabil dan lancar agar dokumen dapat segera dimuat
```

## Error Message Principles

### Tone Guidelines
- ❌ **Avoid**: "Error", "Gagal", "Salah"
- ✅ **Use**: "Kendala", "Gangguan", "Tidak dapat"
- ❌ **Avoid**: Blaming user
- ✅ **Use**: Neutral, helpful tone

### Structure Pattern
1. **Clear problem identification**
2. **Simple explanation (if needed)**
3. **Actionable solution**
4. **Optional CTA for primary action**

### Language Rules
- Use **Bahasa Indonesia** following KBBI
- Avoid technical jargon
- Keep explanations brief
- Provide clear next steps
- Never blame the user

### Context Adaptation
**For Murid (Students)**:
- More encouraging tone
- Simpler language
- "kamu" addressing

**For Guru/Unit Kerja**:
- More formal tone
- Professional language  
- "Anda" addressing

**For Mitra**:
- Business-appropriate tone
- Clear process language
- "Anda" addressing

### Common Error Scenarios

**Form Validation**:
```
"Mohon lengkapi [field name] untuk melanjutkan."
```

**File Upload**:
```
"Ukuran berkas terlalu besar. Maksimal [X] MB."
"Format berkas tidak didukung. Gunakan [formats]."
```

**Permission Denied**:
```
"Kamu perlu masuk ke akun untuk mengakses fitur ini."
```

**Network Issues**:
```
"Koneksi terputus. Periksa jaringan internetmu."
```
