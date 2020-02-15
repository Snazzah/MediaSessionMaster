$(function() {
  var body = $('body');
  $('.menu a').click(function(ev) {
    var selected = 'selected';

    $('.mainview > *, .menu li').removeClass(selected);
    setTimeout(function() {
      $('.mainview > *').not('.selected').css('display', 'none');
    }, 100);

    $(ev.currentTarget).parent().addClass(selected);
    var currentView = $($(ev.currentTarget).attr('href')).css('display', 'block');
    setTimeout(function() {
      currentView.addClass(selected);
    }, 0);

    setTimeout(function() {
      body[0].scrollTop = 0;
    }, 200);
  });
  
  $('.mainview > *').not('.selected').css('display', 'none');

  if(location.hash.slice(1))
    $(`ul.menu [href="#${location.hash.slice(1)}"]`).click();
});