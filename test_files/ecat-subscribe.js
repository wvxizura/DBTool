function erase(field)
{
	if (field.value == "enter email address")
	{
		field.value="";
	}
}

function revert(field)
{
	if (field.value == "")
	{
		field.value="enter email address";
	}
}

function email_check(str)
{
	var at="@";
	var dot=".";
	var lat=str.indexOf(at);
	var lstr=str.length;
	var ldot=str.indexOf(dot);

	if ((str.indexOf(at)==-1)													||
		(str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr)	||
		(str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr)	||
		(str.indexOf(at,(lat+1))!=-1)											||
		(str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot)		||
		(str.indexOf(dot,(lat+2))==-1) 											||
		(str.indexOf(" ")!=-1)													||
		(str.substring(str.length - 1) == ".") )
	{
		return false;
	}

	return true;
}

function hide_confirm_box()
{
	id = "confirm_box";

	if (document.getElementById)
	{// DOM3 = IE5, NS6
		document.getElementById(id).style.display = 'none';
	}
	else
	{
		if (document.layers)
		{//Netscape 4
			document.id.display = 'none';
		}
		else
		{//IE 4
			document.all.id.style.display = 'none';
		}
	}
}

function updateEcatEmail(vl)
{
	jQuery("#eCatEmail").val(jQuery(vl).val());
}

function submit_ecat_form(theId)
{
	var list=new Array();
	var foot = false;
	if (theId == "ecatEmailFooter")
	{
		foot = true;
	}
	
	if(foot == true)
	{
		ecat_email = document.getElementById("ecatEmailFooter").value;
		refPage = document.getElementById("referringPageF").value;
		list = null;
	}
	else
	{
		ecat_email = document.getElementById("ecatEmail").value;
		if (ecat_email == "enter email address")
		{
			ecat_email = document.getElementById("emailAddress").value;
			list[0]= document.getElementById("ecatList").value + "(" + jQuery("#backorderId").val() + ")";
		}
		refPage = document.getElementById("referringPage").value;
	}
	
	if (email_check(ecat_email))
	{
		if (theId == "BACKORDER")
		{
			//nothing
		}
		else
		{
			if(foot == true)
			{
					loadLocalDivInPopup('#eCatWaitF', 'body', 500, 300, function(){});
			}
			else
			{
					loadLocalDivInPopup('#eCatWait', 'body', 500, 300, function(){});
			}
		}				
		var rtn = false;
		jQuery.ajax({
		    data: ({emailAddress : ecat_email, referringPage: refPage, lid: list}),
		    global: false,
			type:'POST',
			url: '/webservices/catalogMember.ajax?js=on',
			success: function(msg) {
				if (theId == "BACKORDER")
				{
					jQuery("#confirm_box").show(1000);
				}
				else
				{
					closeEcatWaitGreyBox();
					if(foot == true)
					{
						jQuery("#exacttargetresponseF").html(msg);
						loadLocalDivInPopup('#eCatResponseF', 'body', 500, 300, function(){});
					}
					else
					{
						jQuery("#exacttargetresponse").html(msg);
						loadLocalDivInPopup('#eCatResponse', 'body', 500, 300, function(){});
					}
				}
			},
			error: function(ErrXMLHttpRequest, textStatus, errorThrown) {

				if (theId == "BACKORDER")
				{
				}
				else
				{
					closeEcatWaitGreyBox();
					if(foot == true)
					{
						jQuery(".exacttargetresponseF").html("<p>Sorry.  Failed to complete action.</p>");
						loadLocalDivInPopup('.eCatResponseF', 'body', 500, 300, function(){});
					}
					else
					{
						jQuery("#exacttargetresponse").html("<p>Sorry.  Failed to complete action.</p>");
						loadLocalDivInPopup('#eCatResponse', 'body', 500, 300, function(){});
					}
				}
			}
		});
		return false;
	}
	else
	{
		alert("Oops...\nThat does not look like a valid email address.\nPlease enter your email address again");
		return false;
	}
}

function closeEcatWaitGreyBox()
{
	jQuery("#greyBoxWindow,#greyBoxOverlay").hide();
	if (typeof document.body.style.maxHeight === "undefined") {
		jQuery("#greyBoxHideSelect").hide();
	}
	greyBoxShowing = false;
	greyBoxCloseFunction();
}

function SubscribeToEcat(email, list)
{
	jQuery.ajax({
	    data: ({emailAddress: email, list: list}),
	    global: false,
		type:'POST',
		url: '/webservices/catalogMember.ajax?js=on',
		success: function(msg) {

			closeEcatWaitGreyBox();
			if(foot == true)
			{
				jQuery("#exacttargetresponseF").html(msg);
				loadLocalDivInPopup('#eCatResponseF', 'body', 500, 300, function(){});
			}
			else
			{
				jQuery("#exacttargetresponse").html(msg);
				loadLocalDivInPopup('#eCatResponse', 'body', 500, 300, function(){});
			}
		},
		error: function(ErrXMLHttpRequest, textStatus, errorThrown) {

			closeEcatWaitGreyBox();
			if(foot == true)
			{
				jQuery(".exacttargetresponseF").html("<p>Sorry.  Failed to complete action.</p>");
				loadLocalDivInPopup('.eCatResponseF', 'body', 500, 300, function(){});
			}
			else
			{
				jQuery("#exacttargetresponse").html("<p>Sorry.  Failed to complete action.</p>");
				loadLocalDivInPopup('#eCatResponse', 'body', 500, 300, function(){});
			}
		}
	});
	
}

function validate_ecat_form(form)
{
	ecat_email = form["emailAddress"].value;
	if (email_check(ecat_email))
	{
		//document.getElementById("ecatForm").submit();
		return true;
	}
	else
	{
		alert("Oops...\nThat does not look like a valid email address.\nPlease enter your email address again");
		return false;
	}
}