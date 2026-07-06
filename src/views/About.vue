<template>
  <div class="min-h-screen pt-20 pb-20">
    <!-- Hero Section -->
    <section class="relative bg-primary text-stone-50 py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-primary_container"></div>
      </div>
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-headline mb-4 md:mb-6 tracking-tight leading-tight">
              Tentang SPEC Camping
            </h1>
            <p class="text-base md:text-lg text-stone-300/90 font-body leading-relaxed mb-6 md:mb-8">
              Destinasi berkuda dan perkemahan premium di jantung Sukabumi
            </p>
            <div class="flex flex-wrap gap-3 md:gap-4">
              <div class="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full">
                <span class="material-symbols-outlined text-secondary-fixed text-sm md:text-base">star</span>
                <span class="font-bold text-sm md:text-base">Premium Experience</span>
              </div>
              <div class="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full">
                <span class="material-symbols-outlined text-secondary-fixed text-sm md:text-base">verified</span>
                <span class="font-bold text-sm md:text-base">Certified Instructors</span>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <img
                src="/image/spec_camp1.jpeg"
                alt="SPEC Camping"
                class="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div class="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div class="order-2 md:order-1">
          <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 shadow-lg">
            <img
              src="/image/spec_camp2.jpeg"
              alt="Cerita Kami"
              class="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
        <div class="order-1 md:order-2">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-primary mb-4 md:mb-6">
            Cerita Kami
          </h2>
          <div class="space-y-3 md:space-y-4 text-on_surface_variant leading-relaxed text-sm md:text-base">
            <p>
              SPEC Camping Sukabumi Prestige Equestrian Center lahir dari kecintaan kami terhadap alam dan kuda. Berdiri di atas lahan hijau seluas 5 hektar di kaki Gunung Pangrango, kami menghadirkan pengalaman berkuda dan berkemah yang autentik dengan sentuhan kemewahan.
            </p>
            <p>
              Nama "SPEC" mencerminkan komitmen kami terhadap kualitas yang spesifik dan istimewa. Setiap aspek dari fasilitas kami dirancang dengan perhatian terhadap detail, mulai dari kandang kuda yang nyaman hingga area perkemahan yang asri.
            </p>
            <p>
              Kami percaya bahwa setiap orang berhak merasakan keajaiban berinteraksi dengan kuda dan keindahan alam Sukabumi. Itulah mengapa kami menyediakan fasilitas yang tidak hanya aman dan profesional, tetapi juga nyaman untuk semua kalangan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section class="bg-primary text-stone-50 py-16 md:py-20 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mb-3 md:mb-4">
            Visi & Misi
          </h2>
          <p class="text-base md:text-lg text-stone-300/90 max-w-2xl mx-auto px-4">
            Menjadi destinasi equestrian dan outdoor experience terbaik di Indonesia
          </p>
        </div>
        <div class="grid md:grid-cols-2 gap-6 md:gap-8">
          <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/10">
            <div class="w-14 h-14 md:w-16 md:h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <span class="material-symbols-outlined text-2xl md:text-3xl text-white">visibility</span>
            </div>
            <h3 class="text-xl md:text-2xl font-bold font-headline mb-3 md:mb-4">Visi</h3>
            <p class="text-stone-300/90 leading-relaxed text-sm md:text-base">
              Menjadi pusat equestrian dan rekreasi alam terdepan yang mengedukasi, menginspirasi, dan memberikan pengalaman tak terlupakan bagi setiap pengunjung.
            </p>
          </div>
          <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/10">
            <div class="w-14 h-14 md:w-16 md:h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <span class="material-symbols-outlined text-2xl md:text-3xl text-white">target</span>
            </div>
            <h3 class="text-xl md:text-2xl font-bold font-headline mb-3 md:mb-4">Misi</h3>
            <ul class="space-y-2 md:space-y-3 text-stone-300/90 text-sm md:text-base">
              <li class="flex gap-2 md:gap-3">
                <span class="text-secondary-fixed">•</span>
                <span>Menyediakan fasilitas berkuda standar internasional</span>
              </li>
              <li class="flex gap-2 md:gap-3">
                <span class="text-secondary-fixed">•</span>
                <span>Mengedukasi masyarakat tentang perawatan dan olahraga berkuda</span>
              </li>
              <li class="flex gap-2 md:gap-3">
                <span class="text-secondary-fixed">•</span>
                <span>Melestarikan alam Sukabumi melalui praktik wisata berkelanjutan</span>
              </li>
              <li class="flex gap-2 md:gap-3">
                <span class="text-secondary-fixed">•</span>
                <span>Memberikan pengalaman camping premium yang aman dan nyaman</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-primary mb-3 md:mb-4">
          Nilai-Nilai Kami
        </h2>
        <p class="text-base md:text-lg text-on_surface_variant max-w-2xl mx-auto px-4">
          Prinsip yang menjadi fondasi setiap layanan kami
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-6 md:gap-8">
        <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span class="material-symbols-outlined text-3xl md:text-4xl text-stone-50">safety_check</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold font-headline text-primary mb-2 md:mb-3">Keselamatan</h3>
          <p class="text-on_surface_variant text-sm md:text-base">
            Prioritas utama dalam setiap aktivitas, dengan peralatan standar dan instruktur bersertifikat.
          </p>
        </div>
        <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 md:w-20 md:h-20 bg-secondary-fixed rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span class="material-symbols-outlined text-3xl md:text-4xl text-white">diamond</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold font-headline text-primary mb-2 md:mb-3">Kualitas Premium</h3>
          <p class="text-on_surface_variant text-sm md:text-base">
            Fasilitas dan layanan terbaik yang dirancang untuk memberikan pengalaman tak terlupakan.
          </p>
        </div>
        <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 md:w-20 md:h-20 bg-tertiary_fixed rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span class="material-symbols-outlined text-3xl md:text-4xl text-white">eco</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold font-headline text-primary mb-2 md:mb-3">Keberlanjutan</h3>
          <p class="text-on_surface_variant text-sm md:text-base">
            Komitmen terhadap pelestarian alam dan praktik wisata yang ramah lingkungan.
          </p>
        </div>
      </div>
    </section>

    <!-- Facilities -->
    <section class="bg-surface_container py-16 md:py-20 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-primary mb-3 md:mb-4">
            Fasilitas Kami
          </h2>
          <p class="text-base md:text-lg text-on_surface_variant max-w-2xl mx-auto px-4">
            Lengkap dan modern untuk kenyamanan maksimal
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div class="bg-surface_container_highest rounded-2xl p-5 md:p-6 shadow-md">
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-white text-sm md:text-base">pets</span>
              </div>
              <h3 class="text-base md:text-lg font-bold font-headline text-primary">Kandang Kuda</h3>
            </div>
            <p class="text-on_surface_variant text-xs md:text-sm">
              20+ kuda ras pilihan dengan kandang modern dan perawatan veterinari rutin
            </p>
          </div>
          <div class="bg-surface_container_highest rounded-2xl p-5 md:p-6 shadow-md">
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-white text-sm md:text-base">track_changes</span>
              </div>
              <h3 class="text-base md:text-lg font-bold font-headline text-primary">Arena Berkuda</h3>
            </div>
            <p class="text-on_surface_variant text-xs md:text-sm">
              Arena indoor dan outdoor dengan permukaan khusus untuk kenyamanan kuda
            </p>
          </div>
          <div class="bg-surface_container_highest rounded-2xl p-5 md:p-6 shadow-md">
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-white text-sm md:text-base">camping</span>
              </div>
              <h3 class="text-base md:text-lg font-bold font-headline text-primary">Area Camping</h3>
            </div>
            <p class="text-on_surface_variant text-xs md:text-sm">
              50+ spot camping dengan pemandangan gunung dan fasilitas lengkap
            </p>
          </div>
          <div class="bg-surface_container_highest rounded-2xl p-5 md:p-6 shadow-md">
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-white text-sm md:text-base">restaurant</span>
              </div>
              <h3 class="text-base md:text-lg font-bold font-headline text-primary">Café & Resto</h3>
            </div>
            <p class="text-on_surface_variant text-xs md:text-sm">
              Menyajikan hidangan lokal dan internasional dengan bahan segar
            </p>
          </div>
          <div class="bg-surface_container_highest rounded-2xl p-5 md:p-6 shadow-md">
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-white text-sm md:text-base">local_parking</span>
              </div>
              <h3 class="text-base md:text-lg font-bold font-headline text-primary">Area Parkir</h3>
            </div>
            <p class="text-on_surface_variant text-xs md:text-sm">
              Parkir luas dan aman untuk mobil dan bus dengan kapasitas 100+ kendaraan
            </p>
          </div>
          <div class="bg-surface_container_highest rounded-2xl p-5 md:p-6 shadow-md">
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-white text-sm md:text-base">wifi</span>
              </div>
              <h3 class="text-base md:text-lg font-bold font-headline text-primary">Free WiFi</h3>
            </div>
            <p class="text-on_surface_variant text-xs md:text-sm">
              Koneksi internet gratis di area umum untuk tetap terhubung
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-primary mb-3 md:mb-4">
          Tim Profesional Kami
        </h2>
        <p class="text-base md:text-lg text-on_surface_variant max-w-2xl mx-auto px-4">
          Dipandu oleh instruktur berpengalaman dan bersertifikat
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 text-center shadow-lg">
          <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-surface_container_high rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-primary">person</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold font-headline text-primary mb-2">Head Instructor</h3>
          <p class="text-secondary-fixed font-medium mb-3 md:mb-4 text-sm md:text-base">15+ Tahun Pengalaman</p>
          <p class="text-on_surface_variant text-xs md:text-sm">
            Mantan atlet equestrian nasional dengan sertifikasi internasional
          </p>
        </div>
        <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 text-center shadow-lg">
          <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-surface_container_high rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-primary">groups</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold font-headline text-primary mb-2">5 Instruktur</h3>
          <p class="text-secondary-fixed font-medium mb-3 md:mb-4 text-sm md:text-base">Bersertifikat</p>
          <p class="text-on_surface_variant text-xs md:text-sm">
            Tim instruktur terlatih untuk semua level kemampuan
          </p>
        </div>
        <div class="bg-surface_container_lowest rounded-3xl p-6 md:p-8 text-center shadow-lg">
          <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-surface_container_high rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-primary">medical_services</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold font-headline text-primary mb-2">Veterinarian</h3>
          <p class="text-secondary-fixed font-medium mb-3 md:mb-4 text-sm md:text-base">Standby</p>
          <p class="text-on_surface_variant text-xs md:text-sm">
            Dokter hewan profesional untuk kesehatan kuda terbaik
          </p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-primary text-stone-50 py-16 md:py-20 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div class="text-center">
            <div class="text-3xl sm:text-4xl md:text-5xl font-black font-headline text-secondary-fixed mb-2">5000+</div>
            <div class="text-stone-300/80 text-xs sm:text-sm md:text-base">Pengunjung Puas</div>
          </div>
          <div class="text-center">
            <div class="text-3xl sm:text-4xl md:text-5xl font-black font-headline text-secondary-fixed mb-2">20+</div>
            <div class="text-stone-300/80 text-xs sm:text-sm md:text-base">Kuda Pilihan</div>
          </div>
          <div class="text-center">
            <div class="text-3xl sm:text-4xl md:text-5xl font-black font-headline text-secondary-fixed mb-2">50+</div>
            <div class="text-stone-300/80 text-xs sm:text-sm md:text-base">Spot Camping</div>
          </div>
          <div class="text-center">
            <div class="text-3xl sm:text-4xl md:text-5xl font-black font-headline text-secondary-fixed mb-2">5+</div>
            <div class="text-stone-300/80 text-xs sm:text-sm md:text-base">Tahun Pengalaman</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div class="bg-gradient-to-br from-secondary to-tertiary rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-white mb-4 md:mb-6">
          Siap untuk Petualangan?
        </h2>
        <p class="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Kunjungi SPEC Camping dan rasakan pengalaman berkuda serta berkemah yang tak terlupakan di Sukabumi.
        </p>
        <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
          <button class="bg-white text-primary px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-lg w-full sm:w-auto">
            Booking Sekarang
          </button>
          <button class="bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/30 transition-all active:scale-95 border border-white/30 w-full sm:w-auto">
            Hubungi Kami
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Custom styles if needed */
</style>
