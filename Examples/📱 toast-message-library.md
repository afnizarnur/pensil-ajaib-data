# 📱 Toast Message Library
_Context Only - Examples for reference_

## Authentication & Session

**Session Expired**
```
Type: Error/Warning
Message: Sesi telah berakhir. Silakan masuk lagi ke akunmu untuk melanjutkan.
Context: When logged-in user tries to access features after session timeout
```

## Share Feature

**Link Copied Successfully**
```
Type: Success
Message: Tautan telah tersalin!
Context: When user successfully copies a sharing link
```

## Materiku Feature

**Material Saved Successfully**
```
Type: Success
Message: Berhasil menyimpan di Materiku
Context: When user saves material to their personal library
```

**Material Added to Collection**
```
Type: Success
Message: Materi tersimpan di koleksi [playlist name]
Context: When user adds material to specific collection/playlist
```

**Material Deleted Successfully**
```
Type: Success
Message: Materi terhapus dari Materiku
Context: When user removes material from their library
```

**Play Order Updated**
```
Type: Success
Message: Urutan pemutaran tersimpan
Context: When user rearranges items in a playlist
```

**Collection Details Saved**
```
Type: Success
Message: Berhasil menyimpan perubahan
Context: When user updates collection/playlist information
```

## Toast Message Patterns

### Success Messages
**Pattern**: `Berhasil [action]`
- Berhasil menyimpan di Materiku
- Berhasil mengirim pesan
- Berhasil memperbarui profil

### Error Messages  
**Pattern**: `Terdapat [problem]. [Solution]`
- Terdapat gangguan koneksi. Periksa jaringan internetmu.
- Terdapat kendala sistem. Silakan coba lagi.

### Information Messages
**Pattern**: `[Status/Action result]`
- Tautan telah tersalin!
- Berkas sedang diunggah...
- Pengaturan telah diperbarui

### Action-Specific Messages
**Pattern**: `[Object] [action result] [location/context]`
- Materi tersimpan di koleksi [name]
- Soal terhapus dari latihan
- Dokumen berhasil diunggah

## Toast Design Principles

### Content Rules
- **Max length**: 1 sentence or 2 lines
- **Language**: Follow user type addressing (kamu vs Anda)
- **Tone**: Positive and clear
- **CTAs**: Only include if essential for user action

### Timing Guidelines
- **Success messages**: 3-4 seconds
- **Error messages**: 5-6 seconds (longer read time)
- **Information**: 4-5 seconds

### User Type Adaptations

**For Murid (Students)**
```
- Use "kamu" addressing
- More encouraging tone
- Simple language
Example: "Latihanmu tersimpan! Kamu bisa melanjutkan nanti."
```

**For Guru/Unit Kerja/Mitra**
```
- Use "Anda" addressing  
- Professional tone
- Clear, direct language
Example: "Data Anda telah tersimpan dengan aman."
```

### Context Categories

**File Operations**
- Upload: "Berkas berhasil diunggah"
- Download: "Unduhan dimulai"
- Delete: "Berkas terhapus"

**Data Operations**  
- Save: "Data tersimpan"
- Update: "Perubahan tersimpan"
- Delete: "Data terhapus"

**Network Issues**
- Connection: "Periksa koneksi internetmu"
- Timeout: "Koneksi terputus. Coba lagi"
- Server: "Terdapat kendala sistem"

**User Actions**
- Copy: "Tersalin ke papan klip"
- Share: "Tautan telah tersalin"  
- Bookmark: "Ditambahkan ke favorit"
