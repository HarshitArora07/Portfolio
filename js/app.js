document.addEventListener('DOMContentLoaded', () => {
    const typewriter = document.getElementById('typewriter');
    const roles = ['Full Stack Developer', 'Web Designer', 'Software Engineer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let introFinished = false;

    const heroIntroEnd = () => {
        if (!introFinished) {
            document.body.classList.add('intro-finished');
            introFinished = true;
        }
    };

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Remove a character
            typewriter.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Add a character
            typewriter.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // Handle word transitions
        if (!isDeleting && charIndex === currentRole.length) {
            if (!introFinished) {
                heroIntroEnd();
            }
            // Wait at the end of the word before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to the next role
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 600; // Small delay before starting next word
        }

        setTimeout(type, typingSpeed);
    }

    // Initialize the typewriter effect after a short delay
    setTimeout(type, 800);

    const menuButton = document.querySelector('.menu-btn');
    const menuWrapper = document.querySelector('.menu-wrapper');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (menuButton && menuWrapper) {
        menuButton.addEventListener('click', () => {
            const isOpen = menuWrapper.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
            const panel = document.getElementById('hero-menu');
            if (panel) {
                panel.setAttribute('aria-hidden', String(!isOpen));
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                menuWrapper.classList.remove('open');
                menuButton.setAttribute('aria-expanded', 'false');
                const panel = document.getElementById('hero-menu');
                if (panel) {
                    panel.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }

    // Mobile: move `.footer-left` above portrait so flow becomes: footer-left -> portrait -> footer-right
    (function handleFooterLeftMobile() {
        const heroContainer = document.querySelector('.hero-container');
        const portrait = document.querySelector('.portrait-container');
        const footer = document.querySelector('.hero-footer');
        if (!heroContainer || !portrait || !footer) return;
        const footerLeft = footer.querySelector('.footer-left');
        const footerRight = footer.querySelector('.footer-right');
        if (!footerLeft || !footerRight) return;

        let moved = false;

        function place() {
            const mobile = window.innerWidth <= 900;
            if (mobile && !moved) {
                // move footerLeft before portrait
                heroContainer.insertBefore(footerLeft, portrait);
                footerLeft.classList.add('moved-to-hero');
                moved = true;
            } else if (!mobile && moved) {
                // move it back into footer before footer-right
                footer.insertBefore(footerLeft, footerRight);
                footerLeft.classList.remove('moved-to-hero');
                moved = false;
            }
        }

        // run on load and resize
        window.addEventListener('resize', place);
        window.addEventListener('orientationchange', place);
        setTimeout(place, 120);
    })();

    // Intersection Observer for divider line animations
    const dividers = document.querySelectorAll('.projects-divider, .about-divider, .journey-divider, .skills-divider, .experience-divider, .process-divider, .education-divider, .contact-divider');
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                dividerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    dividers.forEach(divider => dividerObserver.observe(divider));

    // Intersection Observer for Timeline Items and Progress Line
    const timelineItems = document.querySelectorAll('.timeline-item');
    const progressLine = document.querySelector('.timeline-line-progress');
    const timelineContainer = document.querySelector('.timeline-container-inner');
    const timelineLine = document.querySelector('.timeline-line');
    
    if (timelineItems.length > 0 && progressLine && timelineContainer && timelineLine) {
        const lastItem = timelineItems[timelineItems.length - 1];
        
        // Calculate bottom offset for the track line to end exactly at the center of the last node
        const updateLineLength = () => {
            const containerHeight = timelineContainer.offsetHeight;
            const lastItemTop = lastItem.offsetTop;
            const lastItemHeight = lastItem.offsetHeight;
            const nodeCenter = lastItemTop + (lastItemHeight / 2);
            timelineLine.style.bottom = `${containerHeight - nodeCenter}px`;
        };
        
        // Run once on load, and on window resize
        updateLineLength();
        window.addEventListener('resize', updateLineLength);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Update line length as contents expand/reveal
                    updateLineLength();
                    
                    // Calculate progress height based on the currently intersecting item
                    const itemTop = entry.target.offsetTop;
                    const itemHeight = entry.target.offsetHeight;
                    const containerHeight = timelineContainer.offsetHeight;
                    
                    // Node is centered vertically in the timeline item
                    const progressHeight = itemTop + (itemHeight / 2);
                    const percentage = Math.min(100, Math.max(0, (progressHeight / containerHeight) * 100));
                    
                    progressLine.style.height = `${percentage}%`;
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: "0px 0px -100px 0px"
        });
        
        timelineItems.forEach(item => observer.observe(item));
    }

    // Interactive mouse spotlight effect for Bento Grid Cards
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Mobile interaction: tap to expand
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                // Close others
                bentoCards.forEach(c => {
                    if (c !== card) c.classList.remove('expanded');
                });
                card.classList.toggle('expanded');
            }
        });
    });



    // Animated Step Connector Lines for About Me Section
    const aboutContent = document.querySelector('.about-content');
    const aboutImgWrapper = document.querySelector('.about-img-wrapper');
    const infoBlocks = document.querySelectorAll('.about-info-block');
    const svg = document.querySelector('.about-connector-svg');
    const paths = document.querySelectorAll('.connector-line');

    if (aboutContent && aboutImgWrapper && infoBlocks.length >= 3 && svg && paths.length >= 3) {
        const updateLines = () => {
            if (window.innerWidth <= 900) {
                paths.forEach(p => p.setAttribute('d', ''));
                return;
            }

            const contentRect = aboutContent.getBoundingClientRect();
            const imgRect = aboutImgWrapper.getBoundingClientRect();
            const img = aboutImgWrapper.querySelector('.about-img');

            // Calculate startX at the horizontal center of the rendered image (behind the portrait body)
            let startX = imgRect.left + imgRect.width / 2 - contentRect.left; // Fallback to wrapper center
            if (img && img.naturalWidth && img.naturalHeight) {
                const containerWidth = imgRect.width;
                const containerHeight = imgRect.height;
                const containerRatio = containerWidth / containerHeight;
                const imgRatio = img.naturalWidth / img.naturalHeight;
                
                if (containerRatio > imgRatio) {
                    // Image is height-constrained and centered horizontally inside wrapper
                    const renderedWidth = containerHeight * imgRatio;
                    const sideSpace = (containerWidth - renderedWidth) / 2;
                    startX = imgRect.left + sideSpace + renderedWidth / 2 - contentRect.left;
                } else {
                    // Image is width-constrained, takes full width of wrapper
                    startX = imgRect.left + containerWidth / 2 - contentRect.left;
                }
            }

            // Start Y coordinates spaced along the image wrapper height (30%, 50%, 70%)
            const startYPositions = [
                imgRect.top + imgRect.height * 0.3 - contentRect.top,
                imgRect.top + imgRect.height * 0.5 - contentRect.top,
                imgRect.top + imgRect.height * 0.7 - contentRect.top
            ];

            const textContent = document.querySelector('.about-text-content');

            infoBlocks.forEach((block, index) => {
                if (index > 2) return;
                const path = paths[index];
                const title = block.querySelector('.about-info-title');

                // Use offsetTop/offsetLeft (unaffected by CSS transforms) for accurate layout positions
                // Walk up the offset chain from the title to aboutContent to get true layout Y
                let endY = 0;
                let endX = 0;
                let el = title || block;
                let offsetEl = el;
                while (offsetEl && offsetEl !== aboutContent) {
                    endY += offsetEl.offsetTop;
                    endX += offsetEl.offsetLeft;
                    offsetEl = offsetEl.offsetParent;
                }
                // Center Y on the title height
                endY += (title ? title.offsetHeight / 2 : 12);

                const startY = startYPositions[index];

                // Create a smooth horizontal S-curve (Cubic Bezier)
                const dx = endX - startX;
                const cp1x = startX + dx * 0.4;
                const cp1y = startY;
                const cp2x = endX - dx * 0.4;
                const cp2y = endY;
                
                const d = `M ${startX} ${startY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`;
                path.setAttribute('d', d);

                // Setup dash array/offset for draw animation
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                
                if (!aboutContent.classList.contains('animate-lines')) {
                    path.style.strokeDashoffset = length;
                }
            });
        };

        // Scroll Observer to trigger line animation when the about section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutContent.classList.add('animate-lines');
                    paths.forEach(path => {
                        path.style.strokeDashoffset = '0';
                    });
                    observer.unobserve(entry.target);

                    // Recalculate lines after scroll-reveal transitions settle
                    setTimeout(updateLines, 1800);
                }
            });
        }, {
            threshold: 0.15
        });

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            observer.observe(aboutSection);
        }

        // Recalculate on load and resize
        window.addEventListener('resize', updateLines);
        window.addEventListener('load', updateLines);
        
        // Initial path setup
        updateLines();
    }

    // Intersection Observer for Section Headers scroll animation
    const headerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });

    const headers = document.querySelectorAll('.projects-header, .about-header, .journey-header, .skills-header, .experience-header, .process-header, .education-header, .contact-header');
    headers.forEach(header => headerObserver.observe(header));

    // Contact form submission -> open mail client with the entered details
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').toString().trim();
            const email = (formData.get('email') || '').toString().trim();
            const subject = (formData.get('subject') || '').toString().trim();
            const message = (formData.get('message') || '').toString().trim();

            if (!name || !email || !subject || !message) {
                return;
            }

            const mailtoLink = `mailto:contact.harshitonmail@gmail.com?subject=${encodeURIComponent(`Portfolio Contact: ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }

    // Intersection Observer for Project Cards scroll animation
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });

    const revealElements = document.querySelectorAll('.project-card, .about-info-block, .process-column, .edu-card');
    revealElements.forEach(el => cardObserver.observe(el));

    // Intersection Observer for About Me Image scroll animation (requires 50% visibility)
    const aboutImgEl = document.querySelector('.about-img-wrapper');
    if (aboutImgEl) {
        const aboutImgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        aboutImgObserver.observe(aboutImgEl);
    }

    // ── Experience Card Slider ──────────────────────────────────────
    (function initExpSlider() {
        const track     = document.getElementById('expTrack');
        const wrapper   = document.getElementById('expSliderWrapper');
        const prevBtn   = document.getElementById('expPrev');
        const nextBtn   = document.getElementById('expNext');
        const dots      = document.querySelectorAll('#expIndicators .exp-dot');

        if (!track || !prevBtn || !nextBtn) return;

        const cards = track.querySelectorAll('.exp-card');
        const total = cards.length;
        let current = 0;

        // Update track position, dots, and button states
        function goTo(index, direction) {
            // Clamp
            index = Math.max(0, Math.min(total - 1, index));
            if (index === current) return;
            current = index;

            // Slide
            track.style.transform = `translateX(-${current * 100}%)`;

            // Dots
            dots.forEach((d, i) => d.classList.toggle('active', i === current));

            // Button states
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        dots.forEach(dot => {
            dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index, 10)));
        });

        // Keyboard support when slider is focused
        wrapper.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') goTo(current + 1);
            if (e.key === 'ArrowLeft')  goTo(current - 1);
        });

        // Touch / swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
        }, { passive: true });

        // Entrance animation via IntersectionObserver
        const sliderObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        sliderObserver.observe(wrapper);

        // Set initial state
        prevBtn.disabled = true;
    }());
});
