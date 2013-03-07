var prGVCH={};
var prGECH={};
var prJSC="/review/reviewFeedback.do";

function prLI(src)
{
    var i = new Image();
    i.src = src;
}

function prSHV(reviewId, voteType, actualId) {
    var content='Thank you for your feedback.  Please note that only your first vote will be counted.';

    if(prGVCH[reviewId]==null || prGVCH[reviewId]=='undefined') {
        prLI(prJSC + "?command=helpfulVote&reviewId=" + reviewId + "&voteType=" + voteType + "&actualId=" + actualId);
        prGVCH[reviewId] = 1;
        accepted=true;
    } else {
        content='You may only submit one vote per review.';
    }
    prWCD("review_feedback" + reviewId, content);
}

function prES(stringToEscape) {
    if (encodeURIComponent) {
        stringToEscape = encodeURIComponent(stringToEscape);
    } else {
        stringToEscape = escape(stringToEscape);
    }
    return (stringToEscape);
}

function prRA(string,text,by) {
    // Replaces text with by in string
    var strLength = string.length, txtLength = text.length;
    if ((strLength == 0) || (txtLength == 0)) return string;

    var i = string.indexOf(text);
    if ((!i) && (text != string.substring(0,txtLength))) return string;
    if (i == -1) return string;

    
    var newstr = string.substring(0,i) + by;

    if (i+txtLength < strLength)
        newstr += prRA(string.substring(i+txtLength,strLength),text,by);
    return newstr;
}

function prSE(reviewId)
{
    var contents = 'Thank you for notifying us of this error.';
    var type = prGRV('error_radio' + reviewId);
    var comments = document.getElementById('error_comments' + reviewId).value;
    comments = comments.substring(0, 256);
    var contactEmail = document.getElementById('error_contact_email' + reviewId).value;
    var actualId = document.getElementById('actualId' + reviewId).value;

    var locHREF=document.location.href;
    if (typeof locHREF != 'undefined' && locHREF != null) {
        // get the domain name from the url
        var locDomain = locHREF.split("\/",4)[2];
        comments+= "\n["+locDomain+"]";
    }

    prLI(prJSC + "?command=helpfulVote&reviewId=" + reviewId + "&actualId=" + actualId +  "&merchantId=10396&voteType=" + type + "&errorComments=" + prES(comments)+"&errorContactEmail=" + prES(contactEmail));
    prWCD('review_feedback' + reviewId, contents);
    prGVCH[reviewId] = 1;
    prGECH[reviewId] = 1;
    prCED(reviewId);
}

function prLED(reviewId)
{
    if (prGECH[reviewId] == null || prGECH[reviewId]=='undefined') {
        document.getElementById('error_div' + reviewId).style.display="block";
    } else {
        var contents = 'You have already notified us of an error for this review.';
        prWCD('review_feedback' + reviewId, contents);
    }
}

var prMH={};
function prWCD(divId, msg) {
    prMH[divId]=msg;
    if (!document.getElementById(divId)) {
        window.setTimeout('prWCDNested(\'' + divId + '\')', 1000);
    } else {
        prWCDNested(divId);
    }
}

function prWCDNested(divId)
{
    try {
        var msg = prMH[divId];
        if (!msg) {
            msg = '';
        }
        document.getElementById(divId).innerHTML=msg;
    } catch (e) {
        // nothing, for now.
    }
}

function prHelpful(reviewId, act)
{
    var lineToWrite = '<div class="prReviewTools"><span class="prReviewHelpfulText"><div style="float:left" >Was this review helpful to you?&nbsp;<a class="prReviewHelpfulTextLink" href="javascript:void(0);" onclick="prSHV(\'@@@REVIEW_ID@@@\',\'helpful\',\''+act+'\');"></div><img style="float:left" src="/images/reviews/yes_button.jpg"></a><a class="prReviewHelpfulTextLink" href="javascript:void(0);" onclick="prSHV(\'@@@REVIEW_ID@@@\',\'unhelpful\',\''+act+'\');"><img style="float:left" src="/images/reviews/no_button.jpg"></a></span><span class="prReviewReportIssue"><span class="prReviewReportIssueHyphen">- </span>You may also <a href="javascript:void(@@@REVIEW_ID@@@);" class="prReviewHelpfulTextLink" onclick="prLED(@@@REVIEW_ID@@@);">flag this review</a>.</span></div><div class="errorDiv" id="error_div@@@REVIEW_ID@@@" style="display:none;padding-left:5px;padding-bottom:5px;">Please let us know what kind of issue this is:<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="profane">Profanity<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="wrong_product">Wrong product<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="spam">Spam<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="duplicate">Duplicate<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="copyright">Copyright violation<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="not_review">Not a product review<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="customer_image">Customer image<br>	<input type="radio" name="error_radio@@@REVIEW_ID@@@" value="customer_image">Problem with image<br><input type="radio" name="error_radio@@@REVIEW_ID@@@" value="other" checked="1">Other<br>Email address<br><input type="text" id="error_contact_email@@@REVIEW_ID@@@" cols="20" maxlength="80"><br><input type="hidden" id="actualId@@@REVIEW_ID@@@" value=\''+act+'\'>Comments<br><textarea id="error_comments@@@REVIEW_ID@@@" cols="30" rows="3"></textarea><br><a href="javascript:prSE(\'@@@REVIEW_ID@@@\');">Submit</a></div><div class="prReviewHelpfulText bold" id="review_feedback@@@REVIEW_ID@@@"></div>';
    lineToWrite = prRA(lineToWrite, '@@@REVIEW_ID@@@', reviewId);
    document.write(lineToWrite);
}

function prGRV(radioName)
{
    var radioArr = document.getElementsByName(radioName);
    for (var i = 0; i < radioArr.length; i++)
    {
        if (radioArr[i].checked)
        {
            return radioArr[i].value;
        }
    }
    return null;
}

function prCED(reviewId)
{
    document.getElementById('error_div' + reviewId).style.display="none";
}