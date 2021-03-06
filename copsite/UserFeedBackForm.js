function FeedBack() {
    var Name = document.getElementById('textName').value;
    var Address = document.getElementById('textAddress').value;
    var Email = document.getElementById('textEmail').value;
    var TelNo = document.getElementById('textTelNo').value;
    var MbNo = document.getElementById('textMbNo').value;
    var Subject = document.getElementById('textSubject').value;
    var Comments = document.getElementById('textComment').value;
    var ContentType = document.getElementById('ContentPlaceHolder1_hdnContentType').value;
    var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([com\co\.\in])+$/; // to validate email id
   
    if (Name == "") {
        alert("Name Required.");
    } else if (Address == "") {
        alert("Address Required.");
    } else if (Email == "") {
        alert("Email Required.");
    } else if (!Email.match(emailExp)) {
        alert("Invalid Email Id");

    }
    //else if (TelNo == "") {
    //    alert("Tel no. Required.");
    //}
    else if (MbNo == "") {
        alert("Mob no. Required.");
    } else if (Subject == "") {
        alert("Subject Required.");
    } else if (Comments == "") {
        alert("Comment Required.");
    }
    else if ((ContentType.toUpperCase() != "FEEDBACK") && (ContentType.toUpperCase() != "GRIEVANCES")) {
        alert("Content Type Not Found.");
    }
    else {
        SaveData(Name, Address, Email, TelNo, MbNo, Subject, Comments, ContentType);

    }

}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function ClearControls() {

    document.getElementById('textName').value = "";
    document.getElementById('textAddress').value = "";
    document.getElementById('textEmail').value = "";
    document.getElementById('textTelNo').value = "";
    document.getElementById('textMbNo').value = "";
    document.getElementById('textSubject').value = "";
    document.getElementById('textComment').value = "";
}

function SaveData(Name, Address, Email, TelNo, MbNo, Subject, Comments, ContentType) {

    $.ajax({
        type: "POST",
        url: "FeedBackService.asmx/SaveFeedBack",
        // data: JSON.stringify(obj),
        data: "{'Name':'" + Name + "','Address':'" + Address + "','Email':'" + Email + "','TelNo':'" + TelNo + "','MbNo':'" + MbNo + "','Subject':'" + Subject + "','Comments':'" + Comments + "','ContentType':'" + ContentType + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
               alert('Saved Succesfully')                    
            ClearControls();
        },
        failure: function (msg) {
            alert(msg);
        }
    });
}
    