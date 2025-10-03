# 💬 Dialog Examples  
_Context Only - Examples for reference_

## Confirmation Dialog Examples

### Materiku Feature Dialogs

**Delete Material from Materiku**
```
Title: Hapus dari Materiku?
Body: Materi yang terhapus dari Materiku akan otomatis juga terhapus dari seluruh koleksi di mana materi ini ditambahkan. Materi yang telah terhapus tidak dapat dikembalikan.
Actions: [Ya, Hapus] [Batal]
```

**Delete Collection/Playlist**
```
Title: Apakah kamu yakin ingin menghapus koleksi ini?
Body: Koleksi yang sudah dihapus tidak dapat dikembalikan
Actions: [Hapus Koleksi] [Periksa Kembali]
```

### Latihan Soal Feature Dialogs

**Continue from Previous Progress**
```
Title: Lanjutkan dari pengerjaan sebelumnya?
Body: Progres pengerjaan sebelumnya untuk latihan soal ini masih tersimpan. Kamu dapat melanjutkan dari progres sebelumnya atau memulai lagi dari awal.
Actions: [Lanjutkan] [Mulai dari Awal]
```

**Exit Exercise (No Login)**
```
Title: Keluar dari Latihan Soal?
Body: Progres pengerjaan tetap tersimpan selama kamu menggunakan peramban (browser) yang sama. Kamu dapat melanjutkan pengerjaan nanti.
Actions: [Lanjutkan Pengerjaan] [Keluar]
```

**Exit Exercise (With Login)**
```
Title: Apakah kamu yakin ingin berhenti mengerjakan latihan?
Body: Progres pengerjaan tetap tersimpan di menu Latihanku. Kamu dapat melanjutkan pengerjaan nanti.
Actions: [Lanjutkan Pengerjaan] [Keluar]
```

### CMS Sumber Belajar Dialogs

**Contributor Side - First Submission**
```
Title: Kirim Materi untuk Diperiksa?
Body: Ajuan materi akan diperiksa oleh kurator sebelum akhirnya dapat terbit. Anda dapat diminta untuk melakukan perbaikan jika kurator menemukan ketidaksesuaian.
Actions: [Kirim] [Periksa Kembali]
```

**Contributor Side - Revision Submission**
```
Title: Kirim Perbaikan Sekarang?
Body: Pastikan Anda telah melakukan perbaikan sesuai dengan arahan karena proses perbaikan hanya dapat dilakukan satu kali.
Actions: [Kirim] [Periksa Kembali]
```

**Curator Side - Approve Material**
```
Title: Apakah Anda yakin materi sudah siap terbit?
Body: Materi yang lolos kurasi akan langsung terbit dan dapat diakses oleh murid. Pastikan Anda telah melakukan pemeriksaan dengan teliti dan seksama.
Actions: [Terbitkan] [Periksa Kembali]
```

**Curator Side - Reject Material**
```
Title: Apakah Anda yakin ingin menolak materi ini?
Body: Materi yang ditolak tidak dapat diperbaiki oleh kontributor dan perlu diajukan ulang jika ingin diproses kembali. Pastikan Anda telah melakukan pemeriksaan dengan teliti dan seksama.
Actions: [Tolak] [Periksa Kembali]
```

**Curator Side - Request Revision**
```
Title: Kirim Arahan Perbaikan Sekarang?
Body: Pastikan Anda telah melakukan pemeriksaan dengan teliti dan seksama karena proses perbaikan hanya dapat dilakukan satu kali.
Actions: [Kirim] [Periksa Kembali]
```

## Dialog Structure Pattern

### Standard Structure
```
Title: [Clear question or action confirmation]
Body: [Explanation + Consequences]
Actions: [Primary Action] [Secondary Action/Cancel]
```

### Key Principles
1. **Title**: Always a clear question or confirmation
2. **Body**: Explain what will happen and consequences
3. **Actions**: Use specific verbs, not generic "OK/Cancel"
4. **Tone**: Match user type (kamu for murid, Anda for others)
5. **Consequences**: Always explain what happens after action
6. **Irreversibility**: Clearly state if action cannot be undone
