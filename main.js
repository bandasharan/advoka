// Form validation for victim.html and lawyer.html
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = 'red';
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Please fill all required fields');
      }
    });
  }

  // Lawyer listing and case display functionality
  const acceptButtons = document.querySelectorAll('.accept-btn');
  acceptButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.card');
      const title = card.querySelector('h3').textContent;
      this.textContent = 'Accepted ✓';
      this.disabled = true;
      console.log(`Accepted: ${title}`);
    });
  });
});