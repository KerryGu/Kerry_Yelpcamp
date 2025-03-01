 // Example starter JavaScript for disabling form submissions if there are invalid fields
 (function() {
    'use strict';
    
     //Fetch all the forms we want to apply custom Bootstrap
     var forms = document.querySelectorAll('.validated-form')

      // Loop over them and prevent submission
      Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add('was-validated');
        }, false)
      })
 })()
  

   
    