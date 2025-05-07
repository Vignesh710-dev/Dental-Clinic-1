// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS Animation Library
    AOS.init();
    
    // Add floating animation to hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.classList.add('float-animation');
    }
    
    // Add parallax effect to hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                const translateY = scrollPosition * 0.3;
                heroSection.style.backgroundPositionY = `-${translateY}px`;
            }
        });
    }
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.animated-title');
    if (heroTitle) {
        setTimeout(() => {
            addTypingEffect(heroTitle);
        }, 1500);
    }
    
    // Initialize statistics counters
    const statCounters = document.querySelectorAll('.stat-counter');
    if (statCounters.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target, 2000);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statCounters.forEach(counter => {
            statObserver.observe(counter);
        });
    }
    
    // Handle contact form submission
    // Add at the top of the file
    let isOnline = true;
    
    // Network status detection
    window.addEventListener('online', () => {
        isOnline = true;
        hideNetworkError();
    });
    window.addEventListener('offline', () => {
        isOnline = false;
        showNetworkError();
    });
    
    function showNetworkError() {
        if (!document.getElementById('network-alert')) {
            const networkAlert = document.createElement('div');
            networkAlert.id = 'network-alert';
            networkAlert.className = 'network-error-alert';
            networkAlert.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center">
                    <i class="fas fa-wifi-slash me-2"></i>
                    <span>Network connection lost. Working offline...</span>
                    <button onclick="location.reload()" class="btn btn-sm btn-warning ms-3">Retry</button>
                </div>
            `;
            document.body.prepend(networkAlert);
        }
    }
    
    function hideNetworkError() {
        const alert = document.getElementById('network-alert');
        if (alert) alert.remove();
    }
    
    // Modified contact form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!isOnline) {
                Swal.fire({
                    title: 'Offline Detected',
                    text: 'Please check your internet connection and try again',
                    icon: 'error'
                });
                return;
            }
    
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
            submitBtn.disabled = true;
    
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Twilio WhatsApp API details
            const twilioData = {
                accountSid: 'AC905534ff99d346039e209ba729728a1a',
                authToken: 'e6dc822058d38550d8a7f7a1c2059c22',
                from: 'whatsapp:+14155238886', // Twilio sandbox number
                to: 'whatsapp:+919080700642', // Your number
                body: `New Contact Form Submission:
                    Name: ${formData.name}
                    Email: ${formData.email}
                    Phone: ${formData.phone}
                    Message: ${formData.message}`
            };
            
            // Send to Twilio API
            fetch('https://api.twilio.com/2010-04-01/Accounts/' + twilioData.accountSid + '/Messages.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(twilioData.accountSid + ":" + twilioData.authToken)
                },
                body: new URLSearchParams({
                    From: twilioData.from,
                    To: twilioData.to,
                    Body: twilioData.body
                })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error_code) {
                    Swal.fire({
                        title: 'Message Sent!',
                        text: 'We\'ll contact you shortly via Your Email',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    contactForm.reset();
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Sending Failed',
                    text:  'We\'ll confirm your appointment shortly.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 75,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const animatedElements = document.querySelectorAll('.animated-element');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check elements on load
    checkIfInView();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkIfInView);
});

// Function to show appointment booking alert
function showAppointmentAlert() {
    Swal.fire({
        title: 'Book an Appointment',
        html: `
            <form id="appointmentForm" action="https://formspree.io/f/mrbqpnaq" method="POST" class="text-left">
                <div class="mb-3">
                    <label for="apptName" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="apptName" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="apptEmail" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="apptEmail" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="apptPhone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="apptPhone" name="phone" required>
                </div>
                <div class="mb-3">
                    <label for="apptDate" class="form-label">Preferred Date</label>
                    <input type="date" class="form-control" id="apptDate" name="date" required>
                </div>
                <div class="mb-3">
                    <label for="apptTime" class="form-label">Preferred Time</label>
                    <select class="form-select" id="apptTime" name="time" required>
                        <option value="">Select a time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="apptService" class="form-label">Service Required</label>
                    <select class="form-select" id="apptService" name="service" required>
                        <option value="">Select a service</option>
                        <option value="General Dentistry">General Dentistry</option>
                        <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                        <option value="Orthodontics">Orthodontics</option>
                        <option value="Dental Implants">Dental Implants</option>
                        <option value="Root Canal">Root Canal</option>
                        <option value="Emergency Care">Emergency Care</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Book Now',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const apptForm = document.getElementById('appointmentForm');
            const formData = new FormData(apptForm);
            
            return fetch(apptForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.ok) {
                    return true;
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                Swal.showValidationMessage(`Request failed: ${error}`);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Appointment Booked!',
                text: 'We\'ll confirm your appointment shortly.',
                icon: 'success'
            });
        }
    });
}

// Animated counter for statistics
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Initialize counters when they come into view
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Function to add typing effect
function addTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 50);
}

// Add this to your existing JavaScript file

// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const indicators = document.querySelectorAll('.testimonial-indicator');
    
    if (testimonialsContainer && prevBtn && nextBtn) {
        const testimonialCards = testimonialsContainer.querySelectorAll('.testimonial-card');
        const cardWidth = testimonialCards[0].offsetWidth + 20; // Card width + gap
        let currentIndex = 0;
        
        // Update indicators
        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Scroll to specific testimonial
        function scrollToTestimonial(index) {
            currentIndex = index;
            testimonialsContainer.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            });
            updateIndicators();
        }
        
        // Next button click
        nextBtn.addEventListener('click', () => {
            if (currentIndex < testimonialCards.length - 1) {
                scrollToTestimonial(currentIndex + 1);
            } else {
                scrollToTestimonial(0); // Loop back to first
            }
        });
        
        // Previous button click
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                scrollToTestimonial(currentIndex - 1);
            } else {
                scrollToTestimonial(testimonialCards.length - 1); // Loop to last
            }
        });
        
        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                scrollToTestimonial(index);
            });
        });
        
        // Handle scroll events to update indicators
        testimonialsContainer.addEventListener('scroll', () => {
            const scrollPosition = testimonialsContainer.scrollLeft;
            const newIndex = Math.round(scrollPosition / cardWidth);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateIndicators();
            }
        });
        
        // Touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        testimonialsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left
                if (currentIndex < testimonialCards.length - 1) {
                    scrollToTestimonial(currentIndex + 1);
                }
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right
                if (currentIndex > 0) {
                    scrollToTestimonial(currentIndex - 1);
                }
            }
        }
    }
});
// Handle dental tips video play
document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.querySelector('.tips-video-container');
    if (videoContainer) {
        videoContainer.addEventListener('click', function() {
            Swal.fire({
                html: '<iframe width="100%" height="400" src="https://www.youtube.com/embed/hDZXSMU2lAk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                showConfirmButton: false,
                width: 800,
                padding: '0',
                background: '#000',
                showCloseButton: true
            });
        });
    }
});

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
    
    // Initialize statistics counter
    initStatCounter();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Handle contact form submission with Formspree
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send form data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.ok) {
                    // Success message
                    formStatus.innerHTML = '<div class="alert alert-success">Thank you for your message! We\'ll get back to you soon.</div>';
                    contactForm.reset();
                } else {
                    // Error message
                    formStatus.innerHTML = '<div class="alert alert-danger">Oops! There was a problem submitting your form. Please try again.</div>';
                }
            })
            .catch(error => {
                // Network error message
                formStatus.innerHTML = '<div class="alert alert-danger">Network error. Please check your connection and try again.</div>';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});

// Function to show appointment booking alert
function showAppointmentAlert() {
    Swal.fire({
        title: 'Book an Appointment',
        html: `
            <form id="appointmentForm" action="https://formspree.io/f/mrbqpnaq" method="POST" class="text-left">
                <div class="mb-3">
                    <label for="apptName" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="apptName" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="apptEmail" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="apptEmail" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="apptPhone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="apptPhone" name="phone" required>
                </div>
                <div class="mb-3">
                    <label for="apptDate" class="form-label">Preferred Date</label>
                    <input type="date" class="form-control" id="apptDate" name="date" required>
                </div>
                <div class="mb-3">
                    <label for="apptTime" class="form-label">Preferred Time</label>
                    <select class="form-select" id="apptTime" name="time" required>
                        <option value="">Select a time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="apptService" class="form-label">Service Required</label>
                    <select class="form-select" id="apptService" name="service" required>
                        <option value="">Select a service</option>
                        <option value="General Dentistry">General Dentistry</option>
                        <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                        <option value="Orthodontics">Orthodontics</option>
                        <option value="Dental Implants">Dental Implants</option>
                        <option value="Root Canal">Root Canal</option>
                        <option value="Emergency Care">Emergency Care</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Book Now',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const apptForm = document.getElementById('appointmentForm');
            const formData = {
                name: document.getElementById('apptName').value,
                email: document.getElementById('apptEmail').value,
                phone: document.getElementById('apptPhone').value,
                date: document.getElementById('apptDate').value,
                time: document.getElementById('apptTime').value,
                service: document.getElementById('apptService').value
            };

            // Twilio WhatsApp API details
            const twilioData = {
                accountSid: process.env.TWILIO_ACCOUNT_SID, // Use environment variable
                authToken: process.env.TWILIO_AUTH_TOKEN,   // Use environment variable
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+919080700642',
                body: `New Appointment Request:
                    Name: ${formData.name}
                    Email: ${formData.email}
                    Phone: ${formData.phone}
                    Date: ${formData.date}
                    Time: ${formData.time}
                    Service: ${formData.service}`
            };

            return fetch('https://api.twilio.com/2010-04-01/Accounts/' + twilioData.accountSid + '/Messages.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(twilioData.accountSid + ":" + twilioData.authToken)
                },
                body: new URLSearchParams({
                    From: twilioData.from,
                    To: twilioData.to,
                    Body: twilioData.body
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error_code) {
                    throw new Error(data.message);
                }
                return true;
            })
            .catch(error => {
                Swal.showValidationMessage(`Booking failed: ${error}`);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Appointment Request Sent!',
                text: 'We\'ll confirm your appointment via WhatsApp shortly',
                icon: 'success'
            });
        }
    });
}

// Function to initialize statistics counter
function initStatCounter() {
    const counters = document.querySelectorAll('.stat-counter');
    
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    let count = 0;
                    const speed = Math.floor(2000 / target);
                    
                    const updateCount = () => {
                        if (count < target) {
                            count++;
                            counter.innerText = count;
                            setTimeout(updateCount, speed);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
}

// Function to initialize testimonial slider
function initTestimonialSlider() {
    const container = document.getElementById('testimonialsContainer');
    const wrapper = container ? container.querySelector('.testimonials-wrapper') : null;
    const cards = wrapper ? wrapper.querySelectorAll('.testimonial-card') : [];
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const indicators = document.getElementById('testimonialIndicators');
    const indicatorDots = indicators ? indicators.querySelectorAll('.testimonial-indicator') : [];
    
    if (container && wrapper && cards.length > 0) {
        let currentIndex = 0;
        let startX, moveX, initialPosition, currentTranslate = 0;
        const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
        
        // Set initial position
        updateSliderPosition();
        
        // Add event listeners for buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) {
                    currentIndex++;
                    updateSliderPosition();
                }
            });
        }
        
        // Add event listeners for indicators
        if (indicatorDots.length > 0) {
            indicatorDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSliderPosition();
                });
            });
        }
        
        // Touch events for mobile swipe
        wrapper.addEventListener('touchstart', touchStart);
        wrapper.addEventListener('touchmove', touchMove);
        wrapper.addEventListener('touchend', touchEnd);
        
        function touchStart(event) {
            startX = event.touches[0].clientX;
            initialPosition = currentTranslate;
            wrapper.style.transition = 'none';
        }
        
        function touchMove(event) {
            moveX = event.touches[0].clientX;
            const diff = moveX - startX;
            currentTranslate = initialPosition + diff;
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
        }
        
        function touchEnd() {
            wrapper.style.transition = 'transform 0.3s ease';
            const movedBy = currentTranslate - initialPosition;
            
            if (movedBy < -100 && currentIndex < cards.length - 1) {
                currentIndex++;
            } else if (movedBy > 100 && currentIndex > 0) {
                currentIndex--;
            }
            
            updateSliderPosition();
        }
        
        function updateSliderPosition() {
            currentTranslate = -currentIndex * cardWidth;
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
            wrapper.style.transition = 'transform 0.3s ease';
            
            // Update indicators
            if (indicatorDots.length > 0) {
                indicatorDots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }
    }
}

function handleSubscribe() {
    const email = document.querySelector('#newsletterForm input[type="email"]').value;
    
    // Here you would typically send the email to your backend
    // For demonstration, we'll just show a success message
    Swal.fire({
        title: 'Subscribed!',
        text: 'Thank you for subscribing to our newsletter.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    
    // Reset form
    document.getElementById('newsletterForm').reset();
}

// Add event listener for form submission
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleSubscribe();
});



