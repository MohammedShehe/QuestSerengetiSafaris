// Main function that runs when the page loads
function initSafariWebsite() {
    console.log('🌍 Safari Tours website initializing...');
    
    // Set flag to indicate main script loaded
    window.mainScriptLoaded = true;
    
    // Get all the elements we need
    const planSafariBtn = document.getElementById('plan-safari-btn');
    const quoteForm = document.getElementById('quote-form');
    const closeFormBtn = document.getElementById('close-form-btn');
    const travelDateInput = document.getElementById('travelDate');
    const freeQuoteBtn = document.querySelector('.free-quote-btn');
    const planSafariNavBtns = document.querySelectorAll('.plan-safari-nav-btn');
    
    // Make sure we found all the elements
    if (!planSafariBtn || !quoteForm) {
        console.error('Oops! Could not find some important elements on the page.');
        return;
    }
    
    // Set up the travel date picker - can't travel in the past!
    setupTravelDatePicker(travelDateInput);
    
    // Set up all the event listeners
    setupEventListeners(planSafariBtn, quoteForm, closeFormBtn, travelDateInput);
    
    // Set up navigation buttons to show form
    setupNavigationButtons(freeQuoteBtn, planSafariNavBtns, planSafariBtn, quoteForm);
    
    console.log('✅ Website initialized successfully');
}

// Set up navigation buttons
function setupNavigationButtons(freeQuoteBtn, navBtns, planBtn, form) {
    // Free Quote button in navbar
    if (freeQuoteBtn) {
        freeQuoteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showQuoteForm(planBtn, form);
        });
    }
    
    // Read More buttons in carousel
    navBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showQuoteForm(planBtn, form);
        });
    });
}

// Show quote form function
function showQuoteForm(planBtn, form) {
    // Hide the button
    if (planBtn) planBtn.style.display = 'none';
    
    // Show the form
    form.classList.remove('hidden');
    
    // Smooth scroll to the form
    form.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Put the cursor in the first field
    setTimeout(() => {
        document.getElementById('clientName')?.focus();
    }, 500);
}

// Set up the date picker to prevent past dates
function setupTravelDatePicker(dateInput) {
    if (!dateInput) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    dateInput.min = minDate;
    dateInput.value = minDate; // Set default to tomorrow
    
    console.log('📅 Travel date picker ready - earliest date:', minDate);
}

// Set up all the button clicks and form submissions
function setupEventListeners(planBtn, form, closeBtn, dateInput) {
    
    // When someone clicks "Plan Your Safari"
    planBtn.addEventListener('click', function() {
        console.log('🦁 Plan Your Safari button clicked');
        showQuoteForm(planBtn, form);
    });
    
    // When someone clicks the close form button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('❌ Close form button clicked');
            
            // Hide the form
            form.classList.add('hidden');
            
            // Show the main button again
            planBtn.style.display = 'inline-block';
            
            // Reset the form
            resetForm(form, dateInput);
            
            // Scroll back to the button
            planBtn.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
    }
    
    // When someone submits the form
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the normal form submission
        console.log('📝 Form submission started');
        
        // Validate the form
        if (validateForm()) {
            console.log('✅ Form is valid, processing...');
            
            // Get all the form data
            const formData = collectFormData();
            
            // Show a success message
            showSuccessMessage(form, planBtn);
            
            // Reset the form for next use
            resetForm(form, dateInput);
            
            // In a real website, you would send the data to a server here
            // sendToServer(formData);
            
        } else {
            console.log('❌ Form has errors');
            
            // Scroll to the first error
            scrollToFirstError();
        }
    });
    
    // Add real-time validation to email field
    const emailField = document.getElementById('clientEmail');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmailField(this);
        });
    }
    
    // Add real-time validation to phone field
    const phoneField = document.getElementById('clientPhone');
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            validatePhoneField(this);
        });
    }
    
    // Clear errors when user starts typing
    setupRealTimeValidation(form);
}

// Collect all the data from the form
function collectFormData() {
    const formData = {
        name: document.getElementById('clientName')?.value.trim() || '',
        email: document.getElementById('clientEmail')?.value.trim() || '',
        phone: document.getElementById('clientPhone')?.value.trim() || '',
        country: document.getElementById('clientCountry')?.value || '',
        travelDate: document.getElementById('travelDate')?.value || '',
        tripDuration: document.getElementById('tripLength')?.value || '',
        adults: document.getElementById('adultCount')?.value || '',
        children: document.getElementById('childCount')?.value || '',
        inquiryType: document.getElementById('inquiryType')?.value || '',
        tripDetails: document.getElementById('tripDetails')?.value.trim() || '',
        submittedAt: new Date().toISOString()
    };
    
    console.log('📊 Form data collected:', formData);
    return formData;
}

// Validate the entire form
function validateForm() {
    let isValid = true;
    
    // Get all the form values
    const name = document.getElementById('clientName')?.value.trim() || '';
    const email = document.getElementById('clientEmail')?.value.trim() || '';
    const country = document.getElementById('clientCountry')?.value || '';
    const adults = document.getElementById('adultCount')?.value || '';
    const tripDetails = document.getElementById('tripDetails')?.value.trim() || '';
    const phone = document.getElementById('clientPhone')?.value.trim() || '';
    
    // Clear any previous errors
    clearAllErrors();
    
    // Validate name - can't be empty
    if (!name) {
        showError('clientName', 'Please enter your full name');
        isValid = false;
    }
    
    // Validate email - must be a proper email
    if (!email) {
        showError('clientEmail', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('clientEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate country - must be selected
    if (!country) {
        showError('clientCountry', 'Please select your country');
        isValid = false;
    }
    
    // Validate number of adults - must be selected
    if (!adults) {
        showError('adultCount', 'Please select number of adults');
        isValid = false;
    }
    
    // Validate trip details - can't be empty and should have some detail
    if (!tripDetails) {
        showError('tripDetails', 'Please tell us about your trip');
        isValid = false;
    } else if (tripDetails.length < 20) {
        showError('tripDetails', 'Please provide more details (at least 20 characters)');
        isValid = false;
    }
    
    // Validate phone - optional, but if provided, must be valid
    if (phone && !isValidPhone(phone)) {
        showError('clientPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

// Check if an email looks valid
function isValidEmail(email) {
    // Simple email validation - checks for @ and .
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Check if a phone number looks valid
function isValidPhone(phone) {
    // Remove any spaces, dashes, or parentheses
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if it's a valid international phone number
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    return phonePattern.test(cleanedPhone);
}

// Show an error message for a specific field
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Remove any existing error
    clearError(fieldId);
    
    // Create the error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add it after the field
    field.parentNode.appendChild(errorDiv);
    
    // Add error styling to the field
    field.style.borderColor = '#dc3545';
}

// Clear error for a specific field
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Find and remove any error message
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    
    // Reset field border color
    field.style.borderColor = '#ddd';
}

// Clear all errors from the form
function clearAllErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
    
    // Reset all field borders
    const formFields = document.querySelectorAll('#quote-form input, #quote-form select, #quote-form textarea');
    formFields.forEach(field => {
        field.style.borderColor = '#ddd';
    });
}

// Validate email field in real-time
function validateEmailField(field) {
    const email = field.value.trim();
    if (email && !isValidEmail(email)) {
        showError('clientEmail', 'Please enter a valid email address');
    } else {
        clearError('clientEmail');
    }
}

// Validate phone field in real-time
function validatePhoneField(field) {
    const phone = field.value.trim();
    if (phone && !isValidPhone(phone)) {
        showError('clientPhone', 'Please enter a valid phone number');
    } else {
        clearError('clientPhone');
    }
}

// Set up real-time validation for all fields
function setupRealTimeValidation(form) {
    // Clear errors when user starts typing
    const textFields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    textFields.forEach(field => {
        field.addEventListener('input', function() {
            clearError(this.id);
        });
    });
    
    // Clear errors when user makes a selection
    const selectFields = form.querySelectorAll('select');
    selectFields.forEach(field => {
        field.addEventListener('change', function() {
            clearError(this.id);
        });
    });
}

// Show a success message after form submission
function showSuccessMessage(form, planBtn) {
    // Create the success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
        <h3 style="margin: 0 0 10px 0; color: white;">Safari Plan Request Submitted!</h3>
        <p style="margin: 0; color: white; opacity: 0.9;">
            Thank you for your interest! Our safari experts are already working on your 
            personalized itinerary. You'll receive it via email within 24 hours.
        </p>
    `;
    
    // Insert it before the form
    form.parentNode.insertBefore(successDiv, form);
    
    // Smooth scroll to the message
    successDiv.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Hide the form
    form.classList.add('hidden');
    
    // Show the main button again
    if (planBtn) planBtn.style.display = 'inline-block';
    
    // Remove the success message after 8 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
            console.log('✅ Success message removed');
        }
    }, 8000);
}

// Reset the form to its initial state
function resetForm(form, dateInput) {
    // Reset all form fields
    form.reset();
    
    // Set default values for dropdowns
    const adultCount = document.getElementById('adultCount');
    const childCount = document.getElementById('childCount');
    const tripLength = document.getElementById('tripLength');
    const inquiryType = document.getElementById('inquiryType');
    
    if (adultCount) adultCount.value = '2';
    if (childCount) childCount.value = '0';
    if (tripLength) tripLength.value = '';
    if (inquiryType) inquiryType.value = '';
    
    // Clear any remaining error messages
    clearAllErrors();
    
    // Reset the date picker to tomorrow
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    console.log('🔄 Form reset to initial state');
}

// Scroll to the first error in the form
function scrollToFirstError() {
    const firstError = document.querySelector('.error-message');
    if (firstError) {
        firstError.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// This would be used to send data to a real server
function sendToServer(formData) {
    // In a real application, you would use fetch() or XMLHttpRequest
    // to send the data to your server
    
    console.log('📤 Sending data to server:', formData);
    
    // Example using fetch():
    /*
    fetch('/api/submit-safari-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
    */
}

// Run the initialization when the page loads
document.addEventListener('DOMContentLoaded', initSafariWebsite);

// Also run if DOM is already loaded (for some browsers)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initSafariWebsite, 1);
}