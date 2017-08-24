/*
 * Example Editor Settings
 */
$('#endpoint').val("http://localhost:3030/transformation");
$('#namedGraph').val("http://eatld.et.tu-dresden.de/tggGraph");

var data = {};
data.endpoint = $('#endpoint').val();
data.namedGraph = $('#namedGraph').val();
$.ajax({
  type: "POST", url: "http://localhost:8080/getRuleStore", dataType: "json", data: {data}, success: function (result) {
    $("#targetMetaModel").empty();
    $("#sourceMetaModel").empty();
    for (x in result) {
      var option_t = document.createElement('option');
      option_t.value = result[x]['domainName']['value'];
      option_t.text = result[x]['domainName']['value'];
      var option_s = document.createElement('option');
      option_s.value = result[x]['domainName']['value'];
      option_s.text = result[x]['domainName']['value']
      $("#targetMetaModel")[0].appendChild(option_t);
      $("#sourceMetaModel")[0].appendChild(option_s);
    }
  }
});
