function getdata() {
    var data = { search: [], links: {} };
    $("#searchEng input").each(function (i, el) {
        data.search.push({
            name: $(el).attr("value"),
            action: $(el).attr("action"),
        });
    });
    $("#sp div").each(function (i, el) {
        var name = $(el).attr("name");
        data.links[name] = [];
        $(el).children("a").each(function (j, a) {
            data.links[name].push({
                name: $(a).text(),
                link: $(a).attr("href")
            });
        });
    });
    localStorage["data"] = JSON.stringify(data);
    return data;
}
$(document).ready(function () {
    getdata();
    var data = JSON.parse(localStorage.getItem("data"));
    $("#searchEng").remove();
    $("#sp").remove();
    data.search.forEach(function (i) {
        $("#search").append("<input type='submit' value='" + i.name + "' action='" + i.action + "' />");
    });
    Object.keys(data.links).forEach(function (key) {
        var obj = data.links[key];
        $("#GroupTable tr:first").append("<td class='group'><div name='" + key + "' class='group_spacer'><h1 class='title'>" + key + "</h1><span class='moreLinks'></span></div></td>");
        obj.forEach(function (el, i) {
            if (i < 5) {
                $("[name='" + key + "'] .moreLinks").before("<a href='" + el.link + "' class=\"link\">" + el.name + "</a>");
            }
            else {
                $("[name='" + key + "'] .moreLinks").append("<a href='" + el.link + "' class=\"link\">" + el.name + "</a>");
            }
        });
    });
    $("#search input[type=text]").first().focus();
    $("#search").attr("action", $("#search input[type=submit]:first").attr("action"));
    $("#search input[type=submit]").click(function () {
        var x = $(this).attr("action");
        $("#search").attr("action", x);
    });
    $("#search").submit(function (e) {
        var query = encodeURI($("#query").val());
        var url = $("#search").attr("action").replace("{0}", query);
        e.preventDefault();
        location.href = url;
    });
});
