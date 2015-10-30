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
  getdata();
  var data: DataSet = JSON.parse(localStorage.getItem("data"));
  $("#searchEng").remove();
  $("#sp").remove();

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
