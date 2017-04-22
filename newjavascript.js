$.get('primaryEmails.json', function (emails) {
        
var outGoing = [];

var drafts = [];

function printEmails (arr){
    $('main').addClass('mainContainer');
    $.each(arr, function(i) {
        var email = $('<div>');  
        email.addClass('email'); 
        $('<input type="checkbox">').addClass('checkBox').change(changeEmailCheckbox).appendTo(email);
        $('<img>').attr("src", "https://ssl.gstatic.com/ui/v1/star/star4_2x.png").addClass('starImg').appendTo(email);
        $('<div>').addClass('importantImg').appendTo(email);
        $('<span>').addClass('title').text(arr[i].name).appendTo(email); 
        $('<span>').addClass('content').text(arr[i].content).appendTo(email);  
        $('<span>').addClass('attached').text(arr[i].attached).appendTo(email);  
        $('<span>').addClass('date').text(arr[i].date).appendTo(email);  
        email.appendTo('.mainContainer');  
    });
}

printEmails (emails);
markAsStar ();
markAsImportent ();
 
$('.regular_mails').click (function () {
    $.get('primaryEmails.json', function (emails){
        renderMailsGroups(emails);  
    }); 
});

$('.social_mails').click (function () {
    $.get('socialEmails.json', function (emails){
        renderMailsGroups(emails);  
    });   
});

$('.ads_mails').click (function (){ 
    $.get('promotionEmails.json', function (emails){
        renderMailsGroups(emails);        
    });    
});

$('.outGoing_sec').click (function () {
    renderMailsGroups(outGoing);
});

function renderMailsGroups (mailsGroup){
    var mainContainer = $('.mainContainer');
    mainContainer.text("");
    printEmails (mailsGroup);
    var emails = $('main .email');
    markAsStar ();
    markAsImportent ();
}

$('.newMessage, .new_message1').click (function () {  
    $('#window').removeClass('message_window_non');
    $('#window').addClass('message_window');
    clearInputsValue ();
    $('textarea').attr("placeholder", "");
});

function clearInputsValue () {   
    $('.senders_title').val("");
    $('.senders_content').val("");
    $('textarea').val("");
}

$('.close_message_window').click (function () {
    $('#window').removeClass('message_window');
    $('#window').addClass('message_window_non');
    saveFormContent ();
});
                       
$('form').submit (function () {
    event.preventDefault();
    var incomingMailTitle = $('.senders_title').val();
    var incomingMailContent = $('.senders_content').val();
    outGoing.unshift({
        name: incomingMailTitle,
        content: incomingMailContent,
        date: GetRealDate ()
    });  
    $('#window').removeClass('message_window');
    $('#window').addClass('message_window_non');
    $('.outGoing_sec').css("font-weight", "bold"); 
    var mainContainer = $('.mainContainer');
    mainContainer.text("");
    printEmails (outGoing);
    //var emails = $('main .email');
    $('main .email').each(function (i, email){
        //emails[i].querySelector('input[type=checkbox]').addEventListener('change', changeEmailCheckbox);
        $(email).find('input[type=checkbox]').change(changeEmailCheckbox);
    }); 
    outGoingCounter ();
    return false;
});

function GetRealDate (){ 
    var today = new Date(); 
    var day = today.getDate();
    var month = today.getMonth()+1;  
    var year = today.getFullYear();
    var inComingDate = day+'/'+month+'/'+year;
    return inComingDate;
}

function saveFormContent (){
    if ($('.senders_title').val().length !== 0 || $('.senders_content').val().length !== 0 || $('textarea').val().length !== 0) {
        var draft = {
            name:  $('.senders_title').val(), 
            content: $('.senders_content').val(),
            date: GetRealDate (),
            body: $('textarea').val()
        };
        var json = JSON.stringify(draft);
        localStorage.setItem("newForm", json);
        $('.drafts').css("font-weight", "bold"); 
        var draftEmail = JSON.parse(localStorage.getItem('newForm'));
        drafts.unshift(draftEmail);  
        draftsCounter ();
    }
};

$('.drafts').click (function (){ 
    $('.mainContainer').html("");
    printEmails (drafts);
    var emails = $('main .email');
    $.each(emails, function(i){
        emails[i].querySelector('input[type=checkbox]').addEventListener('change', changeEmailCheckbox);
    });
});

$('.reloadLastDraft').click (function () { 
    if (!localStorage.getItem('newForm')){
        $('textarea').attr("placeholder", "no draft avalible!");  
    }else{     
        var draftEmail = JSON.parse(localStorage.getItem('newForm'));
        $('.senders_title').val(draftEmail.name);
        $('.senders_content').val(draftEmail.content);
        $('textarea').val(draftEmail.body);
    }
});

function outGoingCounter (){ 
    var i = outGoing.length;
    var sum = i++;
    $('.Counter').text('(' + sum + ')');
};

function draftsCounter (){ 
    var i = drafts.length;
    $('.Counter1').text('(' + i + ')');
}

$('.inComing_nav_text').click (function (){ 
    $('.regular_mails').focus();  
    $('.mainContainer').html("");
    printEmails (primary);   
});

$('.deleteDrafts').click (function (){ 
    if (localStorage.getItem('newForm')){
        localStorage.removeItem('newForm');
        $('.Counter1').text("");
        $('.drafts').css("font-weight", "normal"); 
        clearInputsValue ();
        drafts = [];
    }
});

$('.return_checkBox').change (function(e){
    var emails = $('main .email');
    if(e.target.checked) {
         $.each(emails, function(i){   
             emails.addClass('checked');
             $('input[type=checkbox]').prop( "checked", true);
        });
    }else {
         $.each(emails, function(i){   
             emails.removeClass('checked');    
             $('input[type=checkbox]').prop( "checked", false);
        });
    }
});

$('.onclick-menu-content p:first-child').click (function (){
    var emails = $('main .email');
    $.each(emails, function(i){  
        emails.addClass('checked');
        $('input[type=checkbox]').prop( "checked", true);
    });
});


$('.onclick-menu-content p:nth-child(2)').click (function (){  
    var emails = $('main .email');
    $.each(emails, function(i){ 
        emails.removeClass('checked');    
        $('input[type=checkbox]').prop( "checked", false);
    });
});

function changeEmailCheckbox (e){ 
    if(e.target.checked) {e.target.parentNode.classList.add('checked');}
    else {e.target.parentNode.classList.remove('checked');}
};

function markAsStar(){
    $('.starImg').click (function (e){
        if($(e.target)[0].currentSrc === "https://ssl.gstatic.com/ui/v1/star/star4_2x.png"){ 
            $(e.target).attr("src", "https://ssl.gstatic.com/ui/v1/star/star-lit4_2x.png");
        }else{
            $(e.target).attr("src", "https://ssl.gstatic.com/ui/v1/star/star4_2x.png");
        }
    });
}

function markAsImportent (){
    $('.importantImg').click (function (e){
        $( e.target ).toggleClass( "Checked" );
    });
};

});


