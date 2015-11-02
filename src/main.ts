/// <reference path="../typings/jquery/jquery.d.ts"/>

interface DataSet {
  search?: SearchSite[]
  links?: { [key: string]: Link[] }
}
interface SearchSite {
  name: string;
  action: string;
}
interface Link {
  name: string;
  link: string;
}

function getdata(): DataSet {
  var data: DataSet = { search: [], links: {} };
  $("#searchEng input").each((i, el) => {
    data.search.push({
      name: $(el).attr("value"),
      action: $(el).attr("action"),
    });
  });

  $("#sp div").each((i, el) => {
    var name = $(el).attr("name")
    data.links[name] = [];
    $(el).children("a").each((j, a) => {
      data.links[name].push({
        name: $(a).text(),
        link: $(a).attr("href")
      });
    });
  });


  localStorage["data"] = JSON.stringify(data);
  return data;
}

$(document).ready(() => {
  // Work with the old data still
  getdata();
  $("#searchEng").remove();
  $("#sp").remove();

  // Load data in
  var data: DataSet = JSON.parse(localStorage.getItem("data"));
  data.search.forEach(i => {
    $("#search").append(`<input type='submit' value='${i.name}' action='${i.action}' />`)
  });

  Object.keys(data.links).forEach(key => {
    var obj = data.links[key];
    $("#GroupTable tr:first").append(`<td class='group'><div name='${key}' class='group_spacer'><h1 class='title'>${key}</h1><span class='moreLinks'></span></div></td>`);
    obj.forEach((el, i) => {
      if (i < 5) {
        $(`[name='${key}'] .moreLinks`).before(`<a href='${el.link}' class="link">${el.name}</a>`);
      } else {
        $(`[name='${key}'] .moreLinks`).append(`<a href='${el.link}' class="link">${el.name}</a>`);
      }
    });
  });

  // reveal groups
  $(".moreLinks").slideUp();
  $(".group").mouseenter(function() { $(".moreLinks", this).slideDown(); });
  $(".group").mouseleave(function() { if (!$(this).hasClass("lock")) { $(".moreLinks", this).slideUp(); } });
  $(".group").click(function() { $(this).toggleClass("lock"); });

  // slide bars
  $(window).resize(hideShow);
  $(".slider").click(function() {
    if ($(this).children('div').first().is(':visible')) {
      $(this).children('div').first().attr('id') == "start" ? leftSilde() : rightSlide();
    }
  });
  function rightSlide() {
    if ($(".group:visible").length > 2) {
      if (!$('*').is(':animated')) {
        $('.group:visible:first').children().fadeOut("250", hideShow);
        // $('.group:visible:first').children().hide("slide", { direction: "left" }, 250, hideShow);
      }
    }
  }
  function leftSilde() {
    if (!$('*').is(':animated')) {
      $('.group:visible:first').prev().show();
      $('.group:visible:first').children().fadeIn("250", hideShow);
      // $('.group:visible:first').children().show("slide", { direction: "left" }, 250, hideShow);
    }
  }
  function hideShow() {
    var cellWidth = $(".area").width();
    var groupsWidth = $("#GroupTable").width();
    var nextGroupWidth = 1;
    var run = true;

    while (run && (groupsWidth > cellWidth)) {
      if ($('.group:visible').length > 2)
        $('.group:visible:last').hide();
      else
        run = false;
      groupsWidth = $("#GroupTable").width();
    }
    run = true;
    while (run && (nextGroupWidth > 0)) {
      groupsWidth = $("#GroupTable").width();
      if ($('.group:visible:last').next(':hidden').length !== 0)
        nextGroupWidth = $('.group:visible:last').next(':hidden').width();
      else
        nextGroupWidth = 0;
      if (cellWidth > (groupsWidth + nextGroupWidth))
        $('.group:visible:last').next(':hidden').show();
      else
        run = false;
    }
    toggleSliders();
  }
  function toggleSliders() {
    if ($('.group:first').is(':hidden')) { $("#start").show(); $("#start").parent().addClass("slider_color"); }
    else { $("#start").hide(); $("#start").parent().removeClass("slider_color"); }

    if ($('.group:last').is(':hidden')) { $("#end").show(); $("#end").parent().addClass("slider_color"); }
    else { $("#end").hide(); $("#end").parent().removeClass("slider_color"); }
  }

  // handel search
  $("#search input[type=text]").first().focus();

  $("#search").attr("action", $("#search input[type=submit]:first").attr("action"));

  $("#search input[type=submit]").click(function() {
    var x = $(this).attr("action");
    $("#search").attr("action", x);
  });

  $("#search").submit(e => {
    var query = encodeURI($("#query").val());
    var url = $("#search").attr("action").replace("{0}", query);
    e.preventDefault();
    location.href = url;
  });
});
