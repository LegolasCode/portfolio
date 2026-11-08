document.addEventListener("DOMContentLoaded", async () => {
      // 1. Fetch dan Muat Semua Section HTML Secara Otomatis (Modular Sections)
      const includes = document.querySelectorAll("[data-include]");
      for (let el of includes) {
        const file = el.getAttribute("data-include");
        try {
          const response = await fetch(file);
          if (response.ok) {
            el.innerHTML = await response.text();
          } else {
            el.innerHTML = `<p class="text-red-500 text-center py-4">Gagal memuat ${file}</p>`;
          }
        } catch (error) {
          console.error(`Error loading ${file}:`, error);
        }
      }

      // 2. Inisialisasi Lucide Icons Setelah Semua Elemen Ter-render
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // 3. Theme Toggle Script (Dark / Light Mode)
      const themeToggleBtn = document.getElementById('theme-toggle');
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
        });
      }

      // 4. Intersection Observer untuk Animasi Entrance saat Scroll
      const revealElements = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up, .reveal");
      if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              observer.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
      }
    });

    // ==========================================
    // 5. Fungsi Membuka & Menutup Menu Mobile
    // ==========================================
    function toggleMobileMenu() {
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = document.getElementById('menu-icon');
      
      if (!mobileMenu) return;

      const isClosed = mobileMenu.classList.contains('max-h-0');
      
      if (isClosed) {
        // Buka menu (Slide Down)
        mobileMenu.classList.remove('max-h-0', 'opacity-0');
        mobileMenu.classList.add('max-h-96', 'opacity-100');
        if (menuIcon) menuIcon.setAttribute('data-lucide', 'x');
      } else {
        // Tutup menu (Slide Up)
        mobileMenu.classList.remove('max-h-96', 'opacity-100');
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        if (menuIcon) menuIcon.setAttribute('data-lucide', 'menu');
      }
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }

    // ==========================================
    // 6. General Modal Controls (Generic)
    // ==========================================
    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    }

    // ==========================================
    // 7. Image Lightbox & Zoom Controls
    // ==========================================
    let isZoomed = false;

    function openImageModal(element) {
      const img = element.querySelector('img');
      if (!img) return;

      const caption = element.querySelector('span')?.innerText || img.alt;

      const modal = document.getElementById('image-modal');
      const modalImg = document.getElementById('modal-img-src');
      const modalCaption = document.getElementById('modal-img-caption');
      const container = document.getElementById('img-container');

      if (!modal || !modalImg) return;

      modalImg.src = img.src;
      if (modalCaption) modalCaption.innerText = caption;

      // Reset status zoom
      isZoomed = false;
      modalImg.style.transform = 'scale(1)';
      modalImg.classList.remove('max-w-none', 'max-h-none');
      modalImg.classList.add('max-w-full', 'max-h-[80vh]');
      if (container) {
        container.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function toggleZoomImage(event) {
      event.stopPropagation();
      
      const modalImg = document.getElementById('modal-img-src');
      const container = document.getElementById('img-container');
      if (!modalImg) return;
      
      if (!isZoomed) {
        isZoomed = true;
        modalImg.style.transform = 'scale(2)';
        modalImg.classList.remove('max-w-full', 'max-h-[80vh]');
        modalImg.classList.add('max-w-none', 'max-h-none');
        if (container) container.classList.replace('cursor-zoom-in', 'cursor-zoom-out');
      } else {
        isZoomed = false;
        modalImg.style.transform = 'scale(1)';
        modalImg.classList.remove('max-w-none', 'max-h-none');
        modalImg.classList.add('max-w-full', 'max-h-[80vh]');
        if (container) container.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
      }
    }

    function closeImageModal() {
      const modal = document.getElementById('image-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
      isZoomed = false;
    }

    // ==========================================
    // 8. PDF Modal Controls
    // ==========================================
    function openPdfModal(pdfPath, title) {
      const modal = document.getElementById('pdf-modal');
      const iframe = document.getElementById('pdf-frame');
      const titleEl = document.getElementById('pdf-modal-title');

      if (!modal || !iframe) return;

      iframe.src = pdfPath;
      if (titleEl) titleEl.innerText = title;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closePdfModal() {
      const modal = document.getElementById('pdf-modal');
      const iframe = document.getElementById('pdf-frame');
      
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
      if (iframe) {
        iframe.src = ''; // Menghentikan muat file PDF saat ditutup
      }
    }

    // ==========================================
    // 10. Tombol Toggle Show All / Show Less untuk Training
    // ==========================================

    // Fungsi Toggle Show All / Show Less untuk Training
    let isTrainingExpanded = false;

    function toggleTrainingShowAll() {
      const hiddenItems = document.querySelectorAll('.hidden-training');
      const btn = document.getElementById('toggle-training-btn');
      
      isTrainingExpanded = !isTrainingExpanded;
      
      hiddenItems.forEach(item => {
        if (isTrainingExpanded) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      if (btn) {
        btn.innerText = isTrainingExpanded ? 'Show Less' : 'Show All Training (5 More)';
      }
    }

    // ==========================================
    // 10. Global Keyboard Shortcuts (ESC to Close)
    // ==========================================
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
        closePdfModal();
      }
    });