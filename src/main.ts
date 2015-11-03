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
function rightSlide() {
  if ($(".group:visible").length > 1) {
    if (!$('*').is(':animated')) {
      $('.group:visible:first').fadeOut("250", hideShow);
      // $('.group:visible:first').children().hide("slide", { direction: "left" }, 250, hideShow);
    }
  }
}
function leftSilde() {
  if (!$('*').is(':animated')) {
    // $('.group:visible:first').prev().show();
    $('.group:visible:first').prev().fadeIn("250", hideShow);
    // $('.group:visible:first').children().show("slide", { direction: "left" }, 250, hideShow);
  }
}
function hideShow() {
  var width = $(".content").width();
  if ($(".group:visible").length == 0) { $(".group:first").show(); }
  var groupWidth = $(".group:first").outerWidth(true);
  var maxVisible = Math.floor(width / groupWidth);

  var areVisible = false;
  var i = 0;
  $(".group").each((j, el) => {
    if ($(el).is(":visible") && !areVisible) {
      areVisible = true;
    }
    if (areVisible) {
      (i < maxVisible) ? $(el).show() : $(el).hide();
      i++;
    }
  });
  // Toggle Sliders;
  $('.group:first').is(':hidden') ? $("#left-slider").show() : $("#left-slider").hide();
  $('.group:last').is(':hidden') ? $("#right-slider").show() : $("#right-slider").hide();
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
    $(".content").append(`<div class='group' name='${key}' style="display:none"><h3>${key}</h3><span class='links'></span><button>Add</button></div>`);
    obj.forEach((el, i) => {
      $(`[name='${key}'] .links`).prepend(`<a href='${el.link}'>${el.name}</a>`);
    });
  });
  var groupHeight = $(window).height() - ($("footer").height() + $("header").height() + 50);
  $(".group").height(groupHeight);

  // slide bars
  $(window).resize(hideShow);

  $(".slider").click(function() {
    $(this).attr('id') == "left-slider" ? leftSilde() : rightSlide();
  });

  hideShow();

  // handel search
  $("input[type=text]").first().focus();

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
