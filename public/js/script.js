//* ACCORDIONS */
$(document).ready(function() {
  function accordion_toggle(el) {
    $accordion_parent = $(el).closest('.accordion');
    if($accordion_parent.attr('data-state') == 'closed') {
      $accordion_parent.attr('data-state', 'open');
      $(el).attr('title', 'close').html('&ndash;');
    } else if($accordion_parent.attr('data-state') == 'open') {
      $accordion_parent.attr('data-state', 'closed');
      $(el).attr('title', 'expand').html('&plus;');
    }
    accordion_control_all_check_state();
  }
  function accordion_expand_all() {
    $('.accordion').attr('data-state', 'open');
    $('.accordion--control').attr('title', 'close').html('&ndash;');
    accordion_control_all_check_state();
  }
  function accordion_close_all() {
    $('.accordion').attr('data-state', 'closed');
    $('.accordion--control').attr('title', 'expand').html('&plus;');
    accordion_control_all_check_state();
  }
  function accordion_control_all_check_state() {
    var accordions_all_open = true;
    $('.accordion').each(function(el) {
      if ($(this).attr('data-state') == 'closed') {
        accordions_all_open = false;
      }
    });
    if (accordions_all_open == false) {
      $('.accordion--control-all').attr('data-action', 'expand').text('Expand All');
    } else {
      $('.accordion--control-all').attr('data-action', 'close').text('Close All');
    }
  }

  $('.accordion--control').on('click', function(event) {
    event.preventDefault();
    accordion_toggle(this);
  });

  $('.accordion--control-all').on('click', function(event) {
    event.preventDefault();
    if($(this).attr('data-action') == 'expand') {
      accordion_expand_all();
    } else {
      accordion_close_all()
    }
  });

  // init
  accordion_control_all_check_state();
});

