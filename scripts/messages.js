/* Author:

*/

var api_host = "https://cssapi.herokuapp.com";

$('#subscribe_but').click(function(){
  var errors_found = false;
  var frm_email = $('#subscribe_email').val();

  if(frm_email === "") {
    alert("Please give us your email to subscribe");
    return;
  }

  $.ajax({
        url: api_host+'/subscribe',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        type: 'POST',
        cache: false, 
        data: { email: frm_email },
        success: function(data){
          console.log("Subscribe AJAX successful ...");
          alert("Thank you. You have been added to our mailing list. You can un-subscibe at any time. Please follow the instruction in the introductionary email.");
        },
        error: function(jqXHR, textStatus, err){
          console.log("Subscribe sending failed ...");
          alert('Sorry. There was an error subscribing. We do want to hear from you. Please try again in a few moments.');
        }
  })

});

// Send the contact us info
$('#send_msg_but').click(function(){

  // Validate the form first, as the capatcha can only be checked once
  var errors_found = false;
  var frm_fullname = $('#fullname').val();
  var frm_email = $('#email').val();
  var frm_company = $('#company').val();
  var frm_position = $('#position').val();
  var frm_message = $('#message').val();

  if(frm_message === "") {
      $("#err_message").html("<font class=\"pink\">A message is required, otherwise we don't know what you want!.</font>");
      $("input#message").focus();  
      errors_found = true;
  }

  if(frm_email === "") {
      $("#err_email").html("<font class=\"pink\">A valid email is required.</font>");  
      $("input#email").focus();  
      errors_found = true;
  }

  if (frm_fullname === "") {
      $("#err_fullname").html("<font class=\"pink\">Your name is required.</font>");  
      $("input#fullname").focus();  
      errors_found = true;
  }

  if (errors_found) {
    $("#err_message").html("<h3><font class=\"pink\">There are some errors that need correcting.</font></h3>");
    return false;
  }

  validateCaptcha({
    success: function() {
    	$.ajax({
        	url: api_host+'/contact',
          headers: {'X-Requested-With': 'XMLHttpRequest'},
            type: 'POST',
            cache: false, 
            data: { fullname: frm_fullname,
            		email: frm_email,
            		company: frm_company,
            		position: frm_position,
            		message: frm_message
            	  }, 
            success: function(data){
                //console.log("Contact AJAX successful ...");
                //console.log("Data returned: " + JSON.stringify(data));
            	messageSuccess('#contact_form', frm_fullname);
            },
            error: function(jqXHR, textStatus, err){
                console.log("Contact sending failed ...");
            	messageError('#contact_form');
            }
         })

    } // end validateCaptcha success
  });
});            

// Send the contact us info
$('#app_msg_but').click(function(){
	var errors_found = false;
	var frm_appname = $('#appname').val();
	var frm_fullname = $('#fullname').val();
	var frm_email = $('#email').val();
	var frm_reason = $('#reason').val();
	var frm_message = $('#message').val();

	if(frm_message === "") {
      //$("#err_message").html("<font class=\"pink\">A message is required, otherwise we don't know what you want!.</font>");
      $("li#message_li").addClass("danger");
      $("input#message").focus();  
      errors_found = true;
	}

  if($('#reason').index() === 0) {
    $("li#reason_li").addClass("danger");
  }

	if(frm_email === "") {
      //$("#err_email").html("<font class=\"pink\">A valid email is required.</font>");  
      $("li#email_li").addClass("danger");
      $("input#email").focus();  
      errors_found = true;
	}

	if (frm_fullname === "") {
      //$("#err_fullname").html("<font class=\"pink\">Your name is required.</font>");
      $("li#fullname_li").addClass("danger");
      $("input#fullname").focus();  
      errors_found = true;
	}

	if (errors_found) {
		$("#err_message").html("<h3><font class=\"pink\">There are some errors that need correcting.</font></h3>");
		return false;
	}

	$.ajax({
    	url: api_host+'/app_msg',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        type: 'POST',
        cache: false,
        data: { appname: frm_appname,
        	fullname: frm_fullname,
        		email: frm_email,
        		reason: frm_reason,
        		message: frm_message
        	  },
        success: function(data){
        	messageSuccess('#appmsg_form', frm_fullname);
        },
        error: function(jqXHR, textStatus, err){
            console.log("App message failed ...");
            messageError('#appmsg_form');
        }
     })
});

function messageSuccess(_formname, _frm_fullname) {
	$(_formname).html("<div id='message'></div>");  
    $('#message').html("<h2>Your message has been sent.</h2>")  
    .append("<p>Thank you "+_frm_fullname+" for your message, we will be in touch shortly.</p>")  
    .hide()  
    .fadeIn(1000, function() {  
    	$('#message').append("<br /><p>A copy of your message has also been sent to your email address for your reference.</p>");  
    });
};

function messageError(_formname) {
    $(_formname).html("<div id='message'></div>");  
	$('#message').html("<h2>Error sending your message.</h2>")  
   		.append("<p>We are sorry but there was an error sending your message.<br /> ")
   		.append("We really want to hear from you. So please try again in a few moments.</p>")
	;
};

/*
 * Validate the reCaptcha input
 * Ref: http://snipplr.com/view/15563/
 * Modified to work with a node js backend app
 */
function validateCaptcha(options)
{
  challengeField = $("input#recaptcha_challenge_field").val();
  responseField = $("input#recaptcha_response_field").val();
  //console.log(challengeField);
  //console.log(responseField);

  var ajax_ret = $.ajax({
    type: "POST",
    url: api_host+"/capatcha",
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    data: {
      recaptcha_challenge_field: challengeField,
      recaptcha_response_field: responseField,
      async: false
      },
    success: function(data){
        //console.log("Captcha success ...");
        $("#captchaStatus").html("");
        if ($.isFunction(options["success"])) {
          options["success"]();
        }
      },
    error: function(jqXHR, textStatus, err){
        //console.log("Captcha failure ...");
        $("#captchaStatus").html('<p class="pink">The security code you entered did not match. Please try again.</p>');
        Recaptcha.reload();
        if ($.isFunction(options["error"])) {
          options["error"];
        }

      }
    }).responseText;
} 