// script.js

// Mengambil elemen-elemen yang dibutuhkan dari DOM
const slides = document.querySelectorAll('.slide'); // Semua elemen dengan kelas 'slide'
const prevBtn = document.getElementById('prevBtn'); // Tombol 'Sebelumnya'
const nextBtn = document.getElementById('nextBtn'); // Tombol 'Berikutnya'
const slideCounter = document.getElementById('slideCounter'); // Elemen untuk menampilkan nomor slide
const slidesViewport = document.querySelector('.slides-viewport'); // Kontainer yang menampilkan slide

let currentSlide = 0; // Indeks slide yang sedang aktif (dimulai dari 0)
const totalSlides = slides.length; // Jumlah total slide

// Fungsi untuk menampilkan slide tertentu berdasarkan indeksnya
function showSlide(slideIndex, direction = 'next') {
    // Validasi apakah slideIndex berada dalam rentang yang valid
    if (slideIndex < 0 || slideIndex >= totalSlides) {
        console.error("Indeks slide tidak valid:", slideIndex);
        return;
    }

    const oldSlideElement = slides[currentSlide]; // Slide yang aktif sebelumnya
    const newSlideElement = slides[slideIndex];   // Slide yang akan diaktifkan

    // Hapus semua kelas animasi transisi slide dan kelas 'active' dari semua slide.
    // Ini penting untuk memastikan state yang bersih sebelum menerapkan kelas baru.
    slides.forEach(s => {
        s.classList.remove('slide-in-from-right', 'slide-out-to-left', 'slide-in-from-left', 'slide-out-to-right', 'active');
    });

    // Terapkan animasi "keluar" ke slide lama HANYA JIKA slide lama berbeda dari slide baru.
    // Ini mencegah slide pertama (saat load awal) mendapatkan animasi "keluar".
    if (oldSlideElement && oldSlideElement !== newSlideElement) {
        if (direction === 'next') {
            oldSlideElement.classList.add('slide-out-to-left');
        } else { // direction === 'prev'
            oldSlideElement.classList.add('slide-out-to-right');
        }
    }

    // Terapkan animasi "masuk" ke slide baru HANYA JIKA slide baru berbeda dari slide lama.
    // Untuk pemuatan awal slide pertama, kita tidak ingin animasi transisi slide seperti 'slide-in-from-right'.
    // Cukup membuatnya 'active' agar animasi kontennya berjalan.
    if (oldSlideElement !== newSlideElement) {
        if (direction === 'next') {
            newSlideElement.classList.add('slide-in-from-right');
        } else { // direction === 'prev'
            newSlideElement.classList.add('slide-in-from-left');
        }
    }
    // Jika oldSlideElement === newSlideElement (kasus load awal untuk slide 0),
    // tidak ada kelas transisi slide ('slide-in-from-right', dll.) yang ditambahkan ke newSlideElement.
    // Slide tersebut hanya akan mendapatkan kelas 'active'.

    newSlideElement.classList.add('active'); // Jadikan slide baru aktif. Ini akan memicu animasi konten di dalamnya (seperti .animate-on-load).
    currentSlide = slideIndex; // Update indeks slide saat ini

    // Reset posisi scroll viewport ke atas setiap kali slide baru ditampilkan
    if (slidesViewport) {
        slidesViewport.scrollTop = 0;
    }

    // Update teks counter slide
    if (slideCounter) {
        slideCounter.textContent = `Slide ${slideIndex + 1} dari ${totalSlides}`;
    }

    // Atur status tombol navigasi (aktif/nonaktif)
    if (prevBtn) {
        prevBtn.disabled = slideIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = slideIndex === totalSlides - 1;
    }
}

// Fungsi untuk pindah ke slide berikutnya
function goToNextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1, 'next');
    }
}

// Fungsi untuk pindah ke slide sebelumnya
function goToPrevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1, 'prev');
    }
}

// Tambahkan event listener untuk tombol navigasi
if (nextBtn) {
    nextBtn.addEventListener('click', goToNextSlide);
}
if (prevBtn) {
    prevBtn.addEventListener('click', goToPrevSlide);
}

// Tambahkan event listener untuk navigasi menggunakan tombol panah keyboard
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        goToNextSlide();
    } else if (event.key === 'ArrowLeft') {
        goToPrevSlide();
    }
});

// Tampilkan slide pertama saat halaman dimuat
if (slides.length > 0) {
    // Langsung panggil showSlide(0). Dengan logika yang diperbarui,
    // ini akan dengan benar menampilkan slide pertama tanpa animasi transisi slide yang tidak perlu,
    // memungkinkan animasi konten (.animate-on-load) berjalan dengan benar.
    // currentSlide sudah diinisialisasi sebagai 0.
    showSlide(0);
} else {
    console.warn("Tidak ada slide yang ditemukan dalam presentasi.");
    if(slideCounter) slideCounter.textContent = "Tidak ada slide";
    if(prevBtn) prevBtn.disabled = true;
    if(nextBtn) nextBtn.disabled = true;
}