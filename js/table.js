// Difficulty Table
$(function () {
  $.getJSON($("meta[name=bmstable]").attr("content"), function (header) {
    // Table Load Message
    $("#table_int").before(
      "<div id='tableLoading' class='fw-bold text-center'>" +
        "Loading..." +
        "</div>"
    );
    $.getJSON(header.data_url, function (info) {
      if (header.level_order) {
        makeBMSTable(info, header.symbol, header.level_order);
      } else {
        makeBMSTable(info, header.symbol);
      }
      makeChangelog(info, header.symbol);
      // Load Message Remove
      $("#tableLoading").hide();
    });
  });
});

function makeBMSTable(info, mark, order) {
  if (typeof order === "undefined") {
    order = null;
  }

  var x,
    count = 0,
    obj = $("#table_int"),
    shortcut = $("#shortcut_table");

  if (order) {
    var orderAry = [];
    order.forEach((i) => {
      orderAry.push(i.toString());
    });

    info.forEach((i) => {
      i._index = orderAry.indexOf(i.level);
    });

    info.sort((a, b) => {
      if (a._index < b._index) {
        return -1;
      } else if (a._index > b._index) {
        return 1;
      } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    info.forEach((i) => {
      delete i._index;
    });
  } else {
    info.sort((a, b) => {
      var aLv = a.level.toString();
      var bLv = b.level.toString();
      if (isNaN(a.level) == false && isNaN(b.level) == false) {
        return a.level - b.level;
      } else if (aLv < bLv) {
        return -1;
      } else if (aLv > bLv) {
        return 1;
      } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // Table Clear
  obj.html("");
  $(
    "<thead>" +
      "<tr>" +
      "<th style='width: 6%'>Level</th>" +
      "<th style='width: 1%'>Movie</th>" +
      "<th style='width: 1%'>Score</th>" +
      "<th style='width: 20%'>Title</th>" +
      "<th style='width: 20%'>Artist</th>" +
      "<th style='width: 5%'>DL</th>" +
      "<th style='width: 7%'>Date</th>" +
      "<th style='width: 25%'>Comment</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody></tbody>"
  ).appendTo(obj);
  var obj_sep = null;
  shortcut.html("");
  $("<tbody></tbody>").appendTo(shortcut);
  var shortcut_str = $("<tr></tr>");
  info.forEach((i) => {
    if (x != i.level) {
      if (obj_sep != null) {
        if (count != 1) {
          obj_sep.html(
            "<td colspan='8' style='background-color: #cfe2ff' id='" +
              mark +
              x +
              "'>" +
              "<b>" +
              mark +
              x +
              " (" +
              count +
              " Charts)</b>" +
              "</td>"
          );
        } else {
          obj_sep.html(
            "<td colspan='8' style='background-color: #cfe2ff' id='" +
              mark +
              x +
              "'>" +
              "<b>" +
              mark +
              x +
              " (" +
              count +
              " Chart)</b>" +
              "</td>"
          );
        }
        $(
          "<td>" + "<a href='#" + mark + x + "'>" + mark + x + "</a>" + "</td>"
        ).appendTo(shortcut_str);
      }
      obj_sep = $("<tr class='tr_separate' id='" + mark + i.level + "'></tr>");
      obj_sep.appendTo(obj);
      shortcut_str.appendTo(shortcut);
      count = 0;
      x = i.level;
    }
    // Main
    var str = $("<tr></tr>");
    if (i.state == 1) str = $("<tr class='table-info'></tr>");
    if (i.state == 2) str = $("<tr class='table-warning'></tr>");
    if (i.state == 3) str = $("<tr class='table-success'></tr>");
    if (i.state == 4) str = $("<tr class='table-secondary'></tr>");
    if (i.state == 5) str = $("<tr class='table-primary'></tr>");
    if (i.state == 6) str = $("<tr class='table-success'></tr>");

    // Level
    $("<td>" + mark + x + "</td>").appendTo(str);
    // Autoplay
    if (i.movie_link) {
      $(
        "<td>" +
          "<a href='https://www.youtube.com/watch?v=" +
          i.movie_link.slice(-11) +
          "' target='_blank'>" +
          "■" +
          "</a>" +
          "</td>"
      ).appendTo(str);
    } else {
      $("<td></td>").appendTo(str);
    }
    // Score
    $(
      "<td>" +
        "<a href='http://www.ribbit.xyz/bms/score/view?p=1&md5=" +
        i.md5 +
        "' target='_blank'>" +
        "■" +
        "</a>" +
        "</td>"
    ).appendTo(str);

    // Title
    $(
      "<td>" +
        "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" +
        i.md5 +
        "' target='_blank'>" +
        i.title +
        "</a>" +
        "</td>"
    ).appendTo(str);
    // Artist
    var astr = "";
    if (i.url) {
      if (i.artist) {
        astr = "<a href='" + i.url + "'>" + i.artist + "</a>";
      } else {
        astr = "<a href='" + i.url + "'>" + i.url + "</a>";
      }
    } else {
      if (i.artist) {
        astr = i.artist;
      }
    }
    if (i.url_pack) {
      if (i.name_pack) {
        astr += "<br>(<a href='" + i.url_pack + "'>" + i.name_pack + "</a>)";
      } else {
        astr += "<br>(<a href='" + i.url_pack + "'>" + i.url_pack + "</a>)";
      }
    } else {
      if (i.name_pack) {
        astr += "<br>(" + i.name_pack + ")";
      }
    }
    $("<td>" + astr + "</td>").appendTo(str);
    // Chart
    if (i.url_diff) {
      if (i.name_diff) {
        $(
          "<td>" +
            "<a href='" +
            i.url_diff +
            "'>" +
            i.name_diff +
            "</a>" +
            "</td>"
        ).appendTo(str);
      } else {
        $(
          "<td>" + "<a href='" + i.url_diff + "'>" + "DL" + "</a>" + "</td>"
        ).appendTo(str);
      }
    } else {
      if (i.name_diff) {
        $("<td>" + i.name_diff + "</td>").appendTo(str);
      } else {
        $("<td>" + "同梱" + "</td>").appendTo(str);
      }
    }
    // Date
    if (i.date) {
      var addDate = new Date(i.date);
      var dateStr =
        addDate.getFullYear() +
        "." +
        ("0" + (addDate.getMonth() + 1)).slice(-2) +
        "." +
        ("0" + addDate.getDate()).slice(-2);
      $("<td>" + dateStr + "</td>").appendTo(str);
    } else {
      $("<td>Undefined</td>").appendTo(str);
    }
    // Comment
    if (i.comment) {
      $("<td>" + i.comment + "</td>").appendTo(str);
    } else {
      $("<td></td>").appendTo(str);
    }
    str.appendTo(obj);
    count++;
  });

  if (obj_sep != null) {
    if (count != 1) {
      obj_sep.html(
        "<td colspan='8' style='background-color: #cfe2ff' id='" +
          mark +
          x +
          "'>" +
          "<b>" +
          mark +
          x +
          " (" +
          count +
          " Charts)</b>" +
          "</td>"
      );
    } else {
      obj_sep.html(
        "<td colspan='8' style='background-color: #cfe2ff' id='" +
          mark +
          x +
          "'>" +
          "<b>" +
          mark +
          x +
          " (" +
          count +
          " Chart)</b>" +
          "</td>"
      );
    }
    $(
      "<td>" + "<a href='#" + mark + x + "'>" + mark + x + "</a>" + "</td>"
    ).appendTo(shortcut_str);
  }
}

function makeChangelog(info, mark) {
  var history = info
    .filter((i) => {
      return !!i.date;
    })
    .sort((a, b) => {
      var aDate = new Date(a.date);
      var bDate = new Date(b.date);
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    })
    .map((i) => {
      var date_ = new Date(i.date);
      var dateStr =
        date_.getFullYear() +
        "." +
        ("0" + (date_.getMonth() + 1)).slice(-2) +
        "." +
        ("0" + date_.getDate()).slice(-2);
      return "(" + dateStr + ") " + mark + i.level + " " + i.title + " Added.";
    })
    .join("\n");
  $("#changelogText").val(history);
}
