// Navbar Functionality with Retry Logic
class VANavbar {
  constructor() {
    this.init();
  }

  init() {
    // Elements
    this.menuToggle = document.querySelector(".ve-menu-toggle");
    this.nav = document.querySelector(".ve-nav");
    this.dropdowns = document.querySelectorAll(".ve-dropdown");
    this.header = document.querySelector(".ve-header");

    if (!this.menuToggle || !this.nav || !this.header) {
      console.warn("Navbar elements missing.");
      return;
    }

    // State
    this.isMobile = window.innerWidth <= 768;
    this.scrollThreshold = 100;

    this.setupEventListeners();
    this.updateHeaderOnScroll();
  }

  setupEventListeners() {
    // 🔥 MOBILE MENU TOGGLE
    this.menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // 🔥 DROPDOWNS
    this.dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".ve-drop-toggle");

      // Desktop hover
      dropdown.addEventListener("mouseenter", () => {
        if (!this.isMobile) {
          this.closeAllDropdowns();
          dropdown.classList.add("open");
        }
      });

      dropdown.addEventListener("mouseleave", () => {
        if (!this.isMobile) {
          dropdown.classList.remove("open");
        }
      });

      // Mobile click
      if (toggle) {
        toggle.addEventListener("click", (e) => {
          if (this.isMobile) {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown(dropdown);
          }
        });
      }
    });

    // 🔥 CLOSE WHEN CLICKING OUTSIDE
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".ve-dropdown") &&
        !e.target.closest(".ve-menu-toggle") &&
        !e.target.closest(".ve-nav")
      ) {
        this.closeAllDropdowns();
        this.closeMobileMenu();
      }
    });

    // 🔥 ESC KEY
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileMenu();
        this.closeAllDropdowns();
      }
    });

    // 🔥 SCROLL
    window.addEventListener("scroll", () => {
      this.updateHeaderOnScroll();
    });

    // 🔥 RESIZE
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    document
      .querySelectorAll(".ve-nav-list a:not(.ve-drop-toggle)")
      .forEach((link) => {
        link.addEventListener("click", () => {
          if (this.isMobile) {
            this.closeAllDropdowns();
            this.closeMobileMenu();
          }
        });
      });
  }

  toggleMobileMenu() {
    const isOpening = !this.menuToggle.classList.contains("open");

    this.menuToggle.classList.toggle("open");
    this.nav.classList.toggle("open");

    if (isOpening) {
      document.body.style.overflow = "hidden";
      this.closeAllDropdowns();
    } else {
      document.body.style.overflow = "";
    }
  }

  closeMobileMenu() {
    this.menuToggle.classList.remove("open");
    this.nav.classList.remove("open");
    document.body.style.overflow = "";
  }

  toggleDropdown(dropdown) {
    const isOpening = !dropdown.classList.contains("open");
    this.closeAllDropdowns();

    if (isOpening) {
      dropdown.classList.add("open");
    }
  }

  closeAllDropdowns() {
    this.dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
    });
  }

  updateHeaderOnScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.scrollThreshold) {
      this.header.classList.add("scrolled");
    } else {
      this.header.classList.remove("scrolled");
    }
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile && !this.isMobile) {
      this.closeMobileMenu();
      this.closeAllDropdowns();
      document.body.style.overflow = "";
    }
  }
}
// Initialize when script loads
console.log("🚀 Navbar script loaded, attempting to initialize...");

// Also try on DOMContentLoaded as backup
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🔄 DOMContentLoaded event fired, checking navbar again...");
    // Check if navbar is already initialized, if not try again
    const menuToggle = document.querySelector(".ve-menu-toggle");
    if (menuToggle && !menuToggle.__navbarInitialized) {
      console.log("📋 Re-initializing navbar after DOMContentLoaded");
      new VANavbar();
    }
  });
}

// Helper functions
function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Ignore dropdown toggle buttons
      if (this.classList.contains("ve-drop-toggle")) return;

      if (href.length > 1) {
        e.preventDefault();

        const targetElement = document.querySelector(href);

        if (targetElement) {
          // 🔥 CLOSE MOBILE MENU
          const navbar = document.querySelector(".ve-menu-toggle");
          const nav = document.querySelector(".ve-nav");

          if (navbar?.classList.contains("open")) {
            navbar.classList.remove("open");
            nav?.classList.remove("open");
            document.body.style.overflow = "";
          }

          // 🔥 CLOSE DROPDOWNS
          document
            .querySelectorAll(".ve-dropdown.open")
            .forEach((drop) => drop.classList.remove("open"));

          // Smooth scroll
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });
}
function setupActiveLinks() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".ve-nav-list a").forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (
      linkPath === currentPath ||
      (currentPath === "" && linkPath === "index.html") ||
      (currentPath === "index.html" && linkPath === "")
    ) {
      link.classList.add("active");
    }
  });

  // Add CSS for active state
  if (!document.querySelector("style[data-active-links]")) {
    const style = document.createElement("style");
    style.setAttribute("data-active-links", "true");
    style.textContent = `
            .ve-nav-list a.active {
                background: rgba(255, 255, 255, 0.2);
                font-weight: 600;
            }
            
            .ve-nav-list a.active::after {
                width: calc(100% - 28px);
            }
            
            @media (max-width: 768px) {
                .ve-nav-list a.active {
                    background: rgba(255, 255, 255, 0.15);
                }
            }
        `;
    document.head.appendChild(style);
  }
}
