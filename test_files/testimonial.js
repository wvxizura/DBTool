function submit_testimonial_form(myForm)
{
	var fullname = jQuery(myForm).find('input[name=fullName_t]').val();
	var email = jQuery(myForm).find('input[name=emailAddress_t]').val();
	var testimonial = jQuery(myForm).find('textarea[name=testimonial_t]').val();
	var rating = jQuery(myForm).find('input[name=starRate]:checked').val();
	var city = jQuery(myForm).find('input[name=city_t]').val();
	var state = jQuery(myForm).find('input[name=state_t]').val();
	var captcha = jQuery(myForm).find('input[name=captcha]:checked').val();

	if (location.protocol === 'https:') 
	{
		thisUrl = '/support/completeSecureWriteATestimonial.ajax';
	}
	else
	{
		thisUrl = '/support/completeWriteATestimonial.ajax';
	}
	
		jQuery.ajax(
		{
		    data: ({emailAddress:email,fullName:fullname,testimonial:testimonial,city:city,state:state,starRate:rating,captcha:captcha}),
		    global: false,
			type:'POST',
			url: thisUrl,
			success: function(msg) 
			{
			    allDivs= jQuery("div");
			    allDivs.each(function(i) 
			    {
			    	divId = jQuery(allDivs[i]).attr("id");
			    	if (divId == "testimonial_errors")
			        {
			    		jQuery(allDivs[i]).html(msg);
			        }
			    	if (divId == "testimonial_popup_container")
			        {
			    		jQuery(allDivs[i]).scrollTop(0);
			    		if (msg == "Successful")
			    		{
			    			jQuery(allDivs[i]).hide(500);
			    		}
			        }

		    		if (msg == "Successful")
		    		{
				    	if (divId == "testimonial_popup_container2")
				        {
				    		jQuery(allDivs[i]).show(500);
				        }
		    		}
			    });

			},
			error: function(ErrXMLHttpRequest, textStatus, errorThrown) 
			{
				alert("Something went wrong submission!");
			}
		}
		);
		return false;
}

function loadTestimonialPage()
{
/*	Commented out because Star Rating doesnt work unless the form is realoded.
	if (jQuery("#testimonial_popup_container2").length != 0)
	{
		//Element has already been loaded
	}
	else
	{
*/
		//Element has not been loaded - lets load
		if (location.protocol === 'https:') 
		{
			thisUrl = '/support/loadSecureTestimonial.ajax';
		}
		else
		{
			thisUrl = '/support/loadTestimonial.ajax';
		}
		
		jQuery.ajax(
		{
		    data: ({}),
		    global: false,
			type:'POST',
			url: thisUrl,
			success: function(msg) 
			{
			    allDivs= jQuery("div");
			    allDivs.each(function(i) 
			    {
			    	divId = jQuery(allDivs[i]).attr("id");
			    	if (divId == "testimonial-intro")
			        {
			    		jQuery(allDivs[i]).html(msg);
			        }
			    });
	
			    allDivs= jQuery("div");
			    allDivs.each(function(i) 
			    {
			    	divId = jQuery(allDivs[i]).attr("id");
			    	if (divId == "testimonial_popup_container2")
			        {
			    		jQuery(allDivs[i]).hide();
			        }
			    	if (divId == "testimonial_popup_container")
			        {
						jQuery(allDivs[i]).height("410px");
			        }
		        });
			},
			error: function(ErrXMLHttpRequest, textStatus, errorThrown) 
			{
				alert("Something went wrong! - " + textStatus + ", " + errorThrown);
			}
		}
		);
//	}
}

function viewTestimonialPage(pageNumber)
{
	var curPage = 1;
	if (pageNumber == "undefined" || pageNumber == 0 || pageNumber == null || pageNumber == "")
	{
		curPage = 1;
	}
	else
	{
		curPage = pageNumber;
	}
	
/*	Commented out because Star Rating doesnt work unless the form is realoded.
	if (jQuery("#testimonial_popup_container2").length != 0)
	{
		//Element has already been loaded
	}
	else
	{
*/
		//Element has not been loaded - lets load
/*		if (location.protocol === 'https:') 
		{
			thisUrl = '/support/loadSecureTestimonial.ajax';
		}
		else
		{*/
			thisUrl = '/support/viewTestimonials.ajax';
//		}
		
		jQuery.ajax(
		{
		    data: ({currentPage:curPage}),
		    global: false,
			type:'POST',
			url: thisUrl,
			success: function(msg) 
			{
			    allDivs= jQuery("div");
			    allDivs.each(function(i) 
			    {
			    	divId = jQuery(allDivs[i]).attr("id");
			    	classId = jQuery(allDivs[i]).attr("class");
			    	if (divId == "testimonial-view-div")
			        {
			    		jQuery(allDivs[i]).html(msg);
				    	if (jQuery("#testimonialViewDiv").length != 0)
				        {
				    		jQuery(allDivs[i]).height("410px");
				        }
			        }
		        });
			},
			error: function(ErrXMLHttpRequest, textStatus, errorThrown) 
			{
				alert("Something went wrong! - " + textStatus + ", " + errorThrown);
			}
		});
		return false;
//	}
}

