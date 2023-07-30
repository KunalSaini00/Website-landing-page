$('#form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(800);
  
});



$("form").on("submit", e=>{
  submitDetails(document.getElementById("first_name").value, document.getElementById("last_name").value, document.getElementById("email").value, document.getElementById("password").value);
});

document.getElementById('form').addEventListener("submit", e=>{
    e.preventDefault();
})

const d = new Connection(host);

function submitDetails(fname, lname, email, password)
{
    d.Signup(email, password, what);
}

function what(data)
{
    console.log(data);

    if(data.RESULT)
    {
        location.href='/base/login.html';
    }
    else
    {
        alert(data.REASON);
    }
}