$(document).ready(function() {
  $('#get-url-button').on('click', function() {
    console.log("hello");
    window.location.href = '/new/' + document.getElementById('url-to-shorten').value;
  });
});