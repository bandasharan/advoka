// Button hover effects
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', function(e) {
      const x = e.offsetX;
      const y = e.offsetY;
      const centerX = this.offsetWidth / 2;
      const centerY = this.offsetHeight / 2;
      
      const angleX = (y - centerY) / 15;
      const angleY = (centerX - x) / 15;
      
      this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
});