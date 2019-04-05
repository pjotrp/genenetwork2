var Stat_Table_Rows, is_number,
  __hasProp = {}.hasOwnProperty,
  __slice = [].slice;

console.log("start_b");

is_number = function(o) {
  return !isNaN((o - 0) && o !== null);
};

Stat_Table_Rows = [
  {
    vn: "n_of_samples",
    pretty: "N of Samples",
    digits: 0
  }, {
    vn: "mean",
    pretty: "Mean",
    digits: 3
  }, {
    vn: "median",
    pretty: "Median",
    digits: 3
  }, {
    vn: "std_error",
    pretty: "Standard Error (SE)",
    digits: 3
  }, {
    vn: "std_dev",
    pretty: "Standard Deviation (SD)",
    digits: 3
  }, {
    vn: "min",
    pretty: "Minimum",
    digits: 2
  }, {
    vn: "max",
    pretty: "Maximum",
    digits: 2
  }, {
    vn: "range",
    pretty: "Range (log2)",
    digits: 3
  }, {
    vn: "range_fold",
    pretty: "Range (fold)",
    digits: 3
  }, {
    vn: "interquartile",
    pretty: "Interquartile Range",
    url: "http://www.genenetwork.org/glossary.html#Interquartile",
    digits: 3
  }, {
    vn: "skewness",
    pretty: "Skewness",
    digits: 3
  }, {
    vn: "kurtosis",
    pretty: "Kurtosis",
    digits: 3
  }
];

var add, block_by_attribute_value, block_by_index, block_outliers, change_stats_value, create_value_dropdown, edit_data_change, export_sample_table_data, get_sample_table_data, hide_no_value, hide_tabs, make_table, on_corr_method_change, open_trait_selection, populate_sample_attributes_values_dropdown, process_id, redraw_bar_chart, redraw_histogram, redraw_prob_plot, reset_samples_table, sample_group_types, sample_lists, show_hide_outliers, stats_mdp_change, update_stat_values;
add = function() {
  var trait;
  trait = $("input[name=trait_hmac]").val();
  console.log("trait is:", trait);
  return $.colorbox({
    href: "/collections/add?traits=" + trait
  });
};
$('#add_to_collection').click(add);
sample_lists = js_data.sample_lists;
sample_group_types = js_data.sample_group_types;
d3.select("#select_compare_trait").on("click", (function(_this) {
  return function() {
    $('.scatter-matrix-container').remove();
    return open_trait_selection();
  };
})(this));
d3.select("#select_covariates").on("click", (function(_this) {
  return function() {
    return open_covariate_selection();
  };
})(this));
$("#remove_covariates").click(function () {
    $("input[name=covariates]").val("")
    $(".selected_covariates").val("")
});
d3.select("#clear_compare_trait").on("click", (function(_this) {
  return function() {
    return $('.scatter-matrix-container').remove();
  };
})(this));
open_trait_selection = function() {
  return $('#collections_holder').load('/collections/list?color_by_trait #collections_list', (function(_this) {
    return function() {
      $.colorbox({
        inline: true,
        href: "#collections_holder",
        onComplete: function(){
            console.log("before get script")
            $.getScript("/static/new/javascript/get_traits_from_collection.js");
            console.log("after get script")
        }
      });
      return $('a.collection_name').attr('onClick', 'return false');
    };
  })(this));
};
open_covariate_selection = function() {
  return $('#collections_holder').load('/collections/list #collections_list', (function(_this) {
    return function() {
      $.colorbox({
        inline: true,
        href: "#collections_holder",
        onComplete: function(){
            console.log("before get cov script")
            $.getScript("/static/new/javascript/get_covariates_from_collection.js");
            console.log("after get cov script")
        }
      });
      return $('a.collection_name').attr('onClick', 'return false');
    };
  })(this));
};
hide_tabs = function(start) {
  var x, _i, _results;
  _results = [];
  for (x = _i = start; start <= 10 ? _i <= 10 : _i >= 10; x = start <= 10 ? ++_i : --_i) {
    _results.push($("#stats_tabs" + x).hide());
  }
  return _results;
};
stats_mdp_change = function() {
  var selected;
  selected = $(this).val();
  hide_tabs(0);
  return $("#stats_tabs" + selected).show();
};
change_stats_value = function(sample_sets, category, value_type, decimal_places, effects) {
  var current_value, id, in_box, the_value, title_value;
  id = "#" + process_id(category, value_type);
  console.log("the_id:", id);
  in_box = $(id).html;
  current_value = parseFloat($(in_box)).toFixed(decimal_places);
  the_value = sample_sets[category][value_type]();
  console.log("After running sample_sets, the_value is:", the_value);
  if (decimal_places > 0) {
    title_value = the_value.toFixed(decimal_places * 2);
    the_value = the_value.toFixed(decimal_places);
  } else {
    title_value = null;
  }
  console.log("*-* the_value:", the_value);
  console.log("*-* current_value:", current_value);
  if (the_value !== current_value) {
    console.log("object:", $(id).html(the_value));
    if (effects) {
      $(id).html(the_value).effect("highlight");
    } else {
      $(id).html(the_value);
    }
  }
  if (title_value) {
    return $(id).attr('title', title_value);
  }
};
update_stat_values = function(sample_sets) {
  var category, row, show_effects, _i, _len, _ref, _results;
  show_effects = $(".tab-pane.active").attr("id") === "stats_tab";
  _ref = ['samples_primary', 'samples_other', 'samples_all'];
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    category = _ref[_i];
    _results.push((function() {
      var _j, _len1, _results1;
      _results1 = [];
      for (_j = 0, _len1 = Stat_Table_Rows.length; _j < _len1; _j++) {
        row = Stat_Table_Rows[_j];
        console.log("Calling change_stats_value");
        _results1.push(change_stats_value(sample_sets, category, row.vn, row.digits, show_effects));
      }
      return _results1;
    })());
  }
  return _results;
};

update_histogram_width = function() {
  num_bins = $('#histogram').find('g.trace.bars').find('g.point').length

  if (num_bins < 10) {
    width_update = {
      width: 400
    }

    Plotly.relayout('histogram', width_update)
  }
}

redraw_histogram = function() {
  var x;
  var _i, _len, _ref, data;
  _ref = _.values(root.selected_samples[root.stats_group]);
  var trait_vals = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    x = _ref[_i];
    trait_vals.push(x.value);
  }
  Plotly.restyle('histogram', 'x', [trait_vals])

  update_histogram_width()
};

redraw_bar_chart = function() {
  var x;
  var _i, _len, _ref, data;
  _ref = _.values(root.selected_samples[root.stats_group]);
  names_and_values = []
  for (i = 0; i < _ref.length; i++){
      _ref[i]["name"] = Object.keys(root.selected_samples[root.stats_group])[i]
  }
  trait_vals = [];
  trait_vars = [];
  trait_samples = [];

  function sortFunction(a, b) {
    if (a.value === b.value) {
      return 0;
    }
    else {
      return (a.value < b.value) ? -1 : 1;
    }
  }

  if (root.bar_sort == "value") {
    _ref.sort(sortFunction)
  }

  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    x = _ref[_i];
    trait_samples.push(x.name)
    trait_vals.push(x.value);
    if (x["variance"] != undefined) {
      trait_vars.push(x.variance);
    } else{
      trait_vars.push(null)
    }
  }

  root.bar_data[0]['y'] = trait_vals
  root.bar_data[0]['error_y'] = {
    type: 'data',
    array: trait_vars,
    visible: root.errors_exist
  }
  root.bar_data[0]['x'] = trait_samples
  if (trait_vals.length < 256) {
    Plotly.newPlot('bar_chart', root.bar_data, root.bar_layout);
  }
};

redraw_box_plot = function() {
  var y_value_list = []
  for (var sample_group in root.selected_samples){
    var trait_sample_data = _.values(root.selected_samples[sample_group])
    var trait_vals = [];
    for (i = 0, len = trait_sample_data.length; i < len; i++) {
      this_sample_data = trait_sample_data[i];
      trait_vals.push(this_sample_data.value);
    }
    y_value_list.push(trait_vals)
  }

  if (Object.keys(js_data.sample_group_types).length > 1) {
      var update = {
        y: y_value_list
      }
      Plotly.restyle('box_plot', update, [0, 1, 2])
  } else {
      var update = {
        y: y_value_list
      }
      Plotly.restyle('box_plot', update)
  }
}

redraw_violin_plot = function() {
  var y_value_list = []
  for (var sample_group in root.selected_samples){
    var trait_sample_data = _.values(root.selected_samples[sample_group])
    var trait_vals = [];
    for (i = 0, len = trait_sample_data.length; i < len; i++) {
      this_sample_data = trait_sample_data[i];
      trait_vals.push(this_sample_data.value);
    }
    y_value_list.push(trait_vals)
  }

}


redraw_prob_plot = function() {
  return root.redraw_prob_plot_impl(root.selected_samples, root.prob_plot_group);
};

make_table = function() {
  var header, key, row, row_line, table, the_id, the_rows, value, _i, _len, _ref, _ref1;
  header = "<thead><tr><th style=\"text-align: right; padding-left: 5px;\">Statistic</th>";
  _ref = js_data.sample_group_types;
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    value = _ref[key];
    the_id = process_id("column", key);
    if (Object.keys(_ref).length > 1) {
        header += "<th id=\"" + the_id + "\" style=\"text-align: right; padding-left: 5px;\">" + value + "</th>";
    } else {
        header += "<th id=\"" + the_id + "\" style=\"text-align: right; padding-left: 5px;\">Value</th>";
    }
  }

  header += "</thead>";
  the_rows = "<tbody>";
  for (_i = 0, _len = Stat_Table_Rows.length; _i < _len; _i++) {
    row = Stat_Table_Rows[_i];
    if ((row.vn == "range_fold" || row.vn == "range") && js_data.dataset_type == "Publish"){
        continue;
    }
    row_line = "<tr>";
    if (row.url != null) {
      row_line += "<td id=\"" + row.vn + "\" align=\"right\"><a href=\"" + row.url + "\" style=\"color: #000000;\">" + row.pretty + "</a></td>";
    } else {
      row_line += "<td id=\"" + row.vn + "\" align=\"right\">" + row.pretty + "</td>";
    }
    _ref1 = js_data.sample_group_types;
    for (key in _ref1) {
      if (!__hasProp.call(_ref1, key)) continue;
      value = _ref1[key];
      the_id = process_id(key, row.vn);
      row_line += "<td id=\"" + the_id + "\" align=\"right\">N/A</td>";
    }
    row_line += "</tr>";
    the_rows += row_line;
  }
  the_rows += "</tbody>";
  table = header + the_rows;
  return $("#stats_table").append(table);
};
process_id = function() {
  var processed, value, values, _i, _len;
  values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];

  /* Make an id or a class valid javascript by, for example, eliminating spaces */
  processed = "";
  for (_i = 0, _len = values.length; _i < _len; _i++) {
    value = values[_i];
    console.log("value:", value);
    value = value.replace(" ", "_");
    if (processed.length) {
      processed += "-";
    }
    processed += value;
  }
  return processed;
};
edit_data_change = function() {
  var already_seen, checkbox, checked, name, real_dict, real_value, real_variance, row, rows, sample_sets, table, tables, _i, _j, _len, _len1;
  already_seen = {};
  sample_sets = {
    samples_primary: new Stats([]),
    samples_other: new Stats([]),
    samples_all: new Stats([])
  };
  root.selected_samples = {
    samples_primary: {},
    samples_other: {},
    samples_all: {}
  };
  console.log("at beginning:", sample_sets);
  tables = ['samples_primary', 'samples_other'];
  for (_i = 0, _len = tables.length; _i < _len; _i++) {
    table = tables[_i];
    rows = $("#" + table).find('tr');
    for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
      row = rows[_j];
      name = $(row).find('.edit_sample_sample_name').html();
      name = $.trim(name);
      real_value = $(row).find('.edit_sample_value').val();
      checkbox = $(row).find(".edit_sample_checkbox");
      checked = $(checkbox).prop('checked');
      if (checked && is_number(real_value) && real_value !== "") {
        real_value = parseFloat(real_value);
        sample_sets[table].add_value(real_value);
        real_variance = $(row).find('.edit_sample_se').val();
        if (is_number(real_variance)) {
          real_variance = parseFloat(real_variance);
        } else {
          real_variance = null;
        }
        real_dict = {
          value: real_value,
          variance: real_variance
        };
        root.selected_samples[table][name] = real_dict;
        if (!(name in already_seen)) {
          sample_sets['samples_all'].add_value(real_value);
          root.selected_samples['samples_all'][name] = real_dict;
          already_seen[name] = true;
        }
      }
    }
  }
  console.log("towards end:", sample_sets);
  update_stat_values(sample_sets);

  if ($('#histogram').hasClass('js-plotly-plot')){
    console.log("redrawing histogram");
    redraw_histogram();
  }
  if ($('#bar_chart').hasClass('js-plotly-plot')){
    console.log("redrawing bar chart");
    redraw_bar_chart();
  }
  if ($('#box_plot').hasClass('js-plotly-plot')){
    console.log("redrawing box plot");
    redraw_box_plot();
  }
  if ($('#violin_plot').hasClass('js-plotly-plot')){
    console.log("redrawing violin plot");
    redraw_violin_plot();
  }
  if ($('#prob_plot_div').hasClass('js-plotly-plot')){
    console.log("redrawing probability plot");
    return redraw_prob_plot();
  }
};
show_hide_outliers = function() {
  var label;
  console.log("FOOBAR in beginning of show_hide_outliers");
  label = $('#show_hide_outliers').val();
  console.log("lable is:", label);
  if (label === "Hide Outliers") {
    return $('#show_hide_outliers').val("Show Outliers");
  } else if (label === "Show Outliers") {
    console.log("Found Show Outliers");
    $('#show_hide_outliers').val("Hide Outliers");
    return console.log("Should be now Hide Outliers");
  }
};
on_corr_method_change = function() {
  var corr_method;
  corr_method = $('select[name=corr_type]').val();
  console.log("corr_method is:", corr_method);
  $('.correlation_desc').hide();
  $('#' + corr_method + "_r_desc").show().effect("highlight");
  if (corr_method === "lit") {
    return $("#corr_sample_method").hide();
  } else {
    return $("#corr_sample_method").show();
  }
};
$('select[name=corr_type]').change(on_corr_method_change);

submit_special = function(url) {
  $("#trait_data_form").attr("action", url);
  return $("#trait_data_form").submit();
};

submit_corr = function(){
    var url;
    url = "/corr_compute";
    return submit_special(url);
};

$(".corr_compute").on("click", (function(_this) {
  return function() {
    var url;
    url = "/corr_compute";
    return submit_special(url);
  };
})(this));

create_value_dropdown = function(value) {
  return "<option val=" + value + ">" + value + "</option>";
};
populate_sample_attributes_values_dropdown = function() {
  var attribute_info, key, sample_attributes, selected_attribute, value, _i, _len, _ref, _ref1, _results;
  console.log("in beginning of psavd");
  $('#attribute_values').empty();
  sample_attributes = {};
  _ref = js_data.attribute_names;
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    attribute_info = _ref[key];
    sample_attributes[attribute_info.name] = attribute_info.distinct_values;
  }
  console.log("[visa] attributes is:", sample_attributes);
  selected_attribute = $('#exclude_menu').val().replace("_", " ");
  console.log("selected_attribute is:", selected_attribute);
  _ref1 = sample_attributes[selected_attribute];
  _results = [];
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    value = _ref1[_i];
    _results.push($(create_value_dropdown(value)).appendTo($('#attribute_values')));
  }
  return _results;
};
if (js_data.attribute_names.length > 0) {
  populate_sample_attributes_values_dropdown();
}
$('#exclude_menu').change(populate_sample_attributes_values_dropdown);
block_by_attribute_value = function() {
  var attribute_name, cell_class, exclude_by_value;
  attribute_name = $('#exclude_menu').val();
  exclude_by_value = $('#attribute_values').val();
  cell_class = ".column_name-" + attribute_name;
  return $(cell_class).each((function(_this) {
    return function(index, element) {
      var row;
      if ($.trim($(element).text()) === exclude_by_value) {
        row = $(element).parent('tr');
        return $(row).find(".trait_value_input").val("x");
      }
    };
  })(this));
};
$('#exclude_group').click(block_by_attribute_value);
block_by_index = function() {
  var end_index, error, index, index_list, index_set, index_string, start_index, _i, _j, _k, _len, _len1, _ref, _results;
  index_string = $('#remove_samples_field').val();
  index_list = [];
  _ref = index_string.split(",");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    index_set = _ref[_i];
    if (index_set.indexOf('-') !== -1) {
      try {
        start_index = parseInt(index_set.split("-")[0]);
        end_index = parseInt(index_set.split("-")[1]);
        for (index = _j = start_index; start_index <= end_index ? _j <= end_index : _j >= end_index; index = start_index <= end_index ? ++_j : --_j) {
          index_list.push(index);
        }
      } catch (_error) {
        error = _error;
        alert("Syntax error");
      }
    } else {
      index = parseInt(index_set);
      console.log("index:", index);
      index_list.push(index);
    }
  }
  console.log("index_list:", index_list);
  _results = [];
  for (_k = 0, _len1 = index_list.length; _k < _len1; _k++) {
    index = index_list[_k];
    if ($('#block_group').val() === "primary") {
      console.log("block_group:", $('#block_group').val());
      console.log("row:", $('#Primary_' + index.toString()));
      _results.push($('#Primary_' + index.toString()).find('.trait_value_input').val("x"));
    } else if ($('#block_group').val() === "other") {
      console.log("block_group:", $('#block_group').val());
      console.log("row:", $('#Other_' + index.toString()));
      _results.push($('#Other_' + index.toString()).find('.trait_value_input').val("x"));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};
$('#block_by_index').click(block_by_index);
hide_no_value = function() {
  return $('.value_se').each((function(_this) {
    return function(_index, element) {
      if ($(element).find('.trait_value_input').val() === 'x') {
        return $(element).hide();
      }
    };
  })(this));
};
$('#hide_no_value').click(hide_no_value);
block_outliers = function() {
  return $('.outlier').each((function(_this) {
    return function(_index, element) {
      return $(element).find('.trait_value_input').val('x');
    };
  })(this));
};
$('#block_outliers').click(block_outliers);
reset_samples_table = function() {
  $('input[name="transform"]').val("");
  return $('.trait_value_input').each((function(_this) {
    return function(_index, element) {
      console.log("value is:", $(element).val());
      $(element).val($(element).data('value'));
      console.log("data-value is:", $(element).data('value'));
      return $(element).parents('.value_se').show();
    };
  })(this));
};
$('.reset').click(reset_samples_table);

log_normalize_data = function() {
  return $('.trait_value_input').each((function(_this) {
    return function(_index, element) {
      current_value = parseFloat($(element).data("value")) + 1;
      if(isNaN(current_value)) {
        return current_value
      } else {
        $(element).val(Math.log2(current_value).toFixed(3));
        return Math.log2(current_value).toFixed(3)
      }
    };
  })(this));
};

sqrt_normalize_data = function() {
  return $('.edit_sample_value').each((function(_this) {
    return function(_index, element) {
      current_value = parseFloat($(element).data("value")) + 1;
      if(isNaN(current_value)) {
        return current_value
      } else {
        $(element).val(Math.sqrt(current_value).toFixed(3));
        return Math.sqrt(current_value).toFixed(3)
      }
    };
  })(this));
};

qnorm_data = function() {
  return $('.edit_sample_value').each((function(_this) {
    return function(_index, element) {
      current_value = parseFloat($(element).data("value")) + 1;
      if(isNaN(current_value)) {
        return current_value
      } else {
        $(element).val($(element).data("qnorm"));
        return $(element).data("qnorm");
      }
    };
  })(this));
};

normalize_data = function() {
  if ($('#norm_method option:selected').val() == 'log2'){
    if ($('input[name="transform"]').val() != "log2") {
      log_normalize_data()
      $('input[name="transform"]').val("log2")
    }
  }
  else if ($('#norm_method option:selected').val() == 'sqrt'){
    if ($('input[name="transform"]').val() != "sqrt") {
      sqrt_normalize_data()
      $('input[name="transform"]').val("sqrt")
    }
  }
  else if ($('#norm_method option:selected').val() == 'qnorm'){
    if ($('input[name="transform"]').val() != "qnorm") {
      qnorm_data()
      $('input[name="transform"]').val("qnorm")
    }
  }
}

$('#normalize').click(normalize_data);

switch_qnorm_data = function() {
  return $('.trait_value_input').each((function(_this) {
    return function(_index, element) {
      transform_val = $(element).data('transform')
      if (transform_val != "") {
          $(element).val(transform_val.toFixed(3));
      }
      return transform_val
    };
  })(this));
};
$('#qnorm').click(switch_qnorm_data);
get_sample_table_data = function(table_name) {
  var samples;
  samples = [];
  $('#' + table_name).find('.value_se').each((function(_this) {
    return function(_index, element) {
      var attribute_info, key, row_data, _ref;
      row_data = {};
      row_data.name = $.trim($(element).find('.column_name-Sample').text());
      row_data.value = $(element).find('.edit_sample_value').val();
      if ($(element).find('.edit_sample_se').length !== -1) {
        row_data.se = $(element).find('.edit_sample_se').val();
      }
      _ref = js_data.attribute_names;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        attribute_info = _ref[key];
        row_data[attribute_info.name] = $.trim($(element).find('.column_name-' + attribute_info.name.replace(" ", "_")).text());
      }
      console.log("row_data is:", row_data);
      return samples.push(row_data);
    };
  })(this));
  return samples;
};
export_sample_table_data = function() {
  var format, json_sample_data, sample_data;
  sample_data = {};
  sample_data.primary_samples = get_sample_table_data('samples_primary');
  sample_data.other_samples = get_sample_table_data('samples_other');
  console.log("sample_data is:", sample_data);
  json_sample_data = JSON.stringify(sample_data);
  console.log("json_sample_data is:", json_sample_data);
  $('input[name=export_data]').val(json_sample_data);
  console.log("export_data is", $('input[name=export_data]').val());
  format = $('input[name=export_format]').val();
  if (format === "excel") {
    $('#trait_data_form').attr('action', '/export_trait_excel');
  } else {
    $('#trait_data_form').attr('action', '/export_trait_csv');
  }
  console.log("action is:", $('#trait_data_form').attr('action'));
  return $('#trait_data_form').submit();
};

$('.export_format').change(function() {
  $('input[name=export_format]').val( this.value );
  $('.export_format').val( this.value );
});

$('.export').click(export_sample_table_data);
console.log("before registering block_outliers");
$('#block_outliers').click(block_outliers);
console.log("after registering block_outliers");
_.mixin(_.str.exports());

get_sample_vals = function(sample_list) {
  var sample;
  return this.sample_vals = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = sample_list.length; i < len; i++) {
      sample = sample_list[i];
      if (sample.value !== null) {
        results.push(sample.value);
      }
    }
    return results;
  })();
};

get_sample_errors = function(sample_list) {
  var sample;
  return this.sample_vals = (function() {
    var i, len, results;
    variance_exists = false;
    results = [];
    for (i = 0, len = sample_list.length; i < len; i++) {
      sample = sample_list[i];
      if (sample.variance !== null) {
        results.push(sample.variance);
        variance_exists = true;
      }
    }
    return [results, variance_exists];
  })();
};

get_sample_names = function(sample_list) {
  var sample;
  return this.sample_names = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = sample_list.length; i < len; i++) {
      sample = sample_list[i];
      if (sample.value !== null) {
        results.push(sample.name);
      }
    }
    return results;
  })();
};

root.stats_group = 'samples_primary';

if (Object.keys(js_data.sample_group_types).length > 1) {
    full_sample_lists = [sample_lists[0], sample_lists[1], sample_lists[0].concat(sample_lists[1])]
    sample_group_list = [js_data.sample_group_types['samples_primary'], js_data.sample_group_types['samples_other'], js_data.sample_group_types['samples_all']]
} else {
    full_sample_lists = [sample_lists[0]]
    sample_group_list = [js_data.sample_group_types['samples_primary']]
}

// Define Plotly Options (for the options bar at the top of each figure)

root.modebar_options = {
  modeBarButtonsToRemove:['hoverClosest', 'hoverCompare', 'hoverClosestCartesian', 'hoverCompareCartesian', 'lasso2d', 'toggleSpikelines']
}

// Bar Chart

root.errors_exist = get_sample_errors(sample_lists[0])[1]
var bar_trace = {
    x: get_sample_names(sample_lists[0]),
    y: get_sample_vals(sample_lists[0]),
    error_y: {
        type: 'data',
        array: get_sample_errors(sample_lists[0])[0],
        visible: root.errors_exist
    },
    type: 'bar'
}

root.bar_data = [bar_trace]

positive_error_vals = []
negative_error_vals = []
for (i = 0;i < get_sample_vals(sample_lists[0]).length; i++){
    if (get_sample_errors(sample_lists[0])[0][i] != undefined) {
        positive_error_vals.push(get_sample_vals(sample_lists[0])[i] + get_sample_errors(sample_lists[0])[0][i])
        negative_error_vals.push(get_sample_vals(sample_lists[0])[i] - get_sample_errors(sample_lists[0])[0][i])
    } else {
        positive_error_vals.push(get_sample_vals(sample_lists[0])[i])
        negative_error_vals.push(get_sample_vals(sample_lists[0])[i])
    }
}

// Calculate the y axis cutoff to avoid a situation where all bar variation is clustered at the top of the chart
min_y_val = Math.min(...negative_error_vals)
max_y_val = Math.max(...positive_error_vals)

if (min_y_val == 0) {
    range_top = max_y_val + Math.abs(max_y_val)*0.1
    range_bottom = 0;
} else {
    range_top = max_y_val + Math.abs(max_y_val)*0.1
    range_bottom = min_y_val - Math.abs(min_y_val)*0.1
    if (min_y_val > 0) {
        range_bottom = min_y_val - 0.1*Math.abs(min_y_val)
    } else if (min_y_val < 0) {
        range_bottom = min_y_val + 0.1*min_y_val
    } else {
        range_bottom = 0
    }
}

root.chart_range = [range_bottom, range_top]

total_sample_count = 0
for (i = 0, i < sample_lists.length; i++;) {
  total_sample_count += get_sample_vals(sample_lists[i]).length
}

if (js_data.num_values < 256) {
  bar_chart_width = 25 * get_sample_vals(sample_lists[0]).length

  var layout = {
    yaxis: {
        range: root.chart_range,
    },
    width: bar_chart_width,
    height: 600,
    margin: {
        l: 50,
        r: 30,
        t: 30,
        b: 80
    }
  };
  root.bar_layout = layout
  $('.bar_chart_tab').click(function() {
    if ($('#bar_chart').hasClass('js-plotly-plot')){
      redraw_bar_chart();
    } else {
      Plotly.newPlot('bar_chart', root.bar_data, root.bar_layout, root.modebar_options)
    }
  });
}

if (full_sample_lists.length > 1) {
    root.box_layout = {
        boxgap: 0.2,
        yaxis: {
            range: [range_bottom, range_top],
        },
        width: 600,
        height: 500,
        margin: {
            l: 50,
            r: 30,
            t: 30,
            b: 80
        }
    };
    var trace1 = {
        y: get_sample_vals(full_sample_lists[0]),
        type: 'box',
        name: sample_group_list[0],
        boxpoints: 'Outliers',
        jitter: 0.5,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        pointpos: -3,
        marker: {
            color: 'rgb(0, 0, 255)',
            size: 3
        },
        line: {
            width: 1
        }
    }
    var trace2 = {
        y: get_sample_vals(full_sample_lists[1]),
        type: 'box',
        name: sample_group_list[1],
        boxpoints: 'Outliers',
        jitter: 0.5,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        pointpos: -3,
        marker: {
            color: 'rgb(200, 0, 0)',
            size: 3
        },
        line: {
            width: 1
        }
    }
    var trace3 = {
        y: get_sample_vals(full_sample_lists[2]),
        type: 'box',
        name: sample_group_list[2],
        boxpoints: 'Outliers',
        jitter: 0.5,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        pointpos: -3,
        marker: {
            color: 'rgb(0, 104, 0)',
            size: 3
        },
        line: {
            width: 1
        }
    }
    box_data = [trace1, trace2, trace3]
} else {
    root.box_layout = {
        yaxis: {
            range: [range_bottom, range_top],
        },
        width: 400,
        height: 500,
        margin: {
            l: 50,
            r: 30,
            t: 30,
            b: 80
        }
    };
    box_data = [
      {
        type: 'box',
        y: get_sample_vals(full_sample_lists[0]),
        name: sample_group_list[0],
        boxpoints: 'Outliers',
        jitter: 0.5,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        pointpos: -3,
        marker: {
            size: 3
        },
        line: {
            width: 1
        }
      }
    ]
}

box_obj = {
  data: box_data,
  layout: root.box_layout
}

$('.box_plot_tab').click(function() {
  if ($('#box_plot').hasClass('js-plotly-plot')){
    redraw_box_plot();
  } else {
    Plotly.newPlot('box_plot', box_obj, root.modebar_options);
  }
});

// Violin Plot

if (full_sample_lists.length > 1) {
    root.violin_layout = {
      title: "Violin Plot",
      yaxis: {
        range: [range_bottom, range_top],
        zeroline: false
      },
      width: 600,
      height: 500,
      margin: {
            l: 50,
            r: 30,
            t: 80,
            b: 80
      }
    };
    var trace1 = {
        y: get_sample_vals(full_sample_lists[2]),
        type: 'violin',
        points: 'none',
        box: {
          visible: true
        },
        line: {
          color: 'green',
        },
        meanline: {
          visible: true
        },
        name: sample_group_list[2],
        x0: sample_group_list[2]
    }
    var trace2 = {
        y: get_sample_vals(full_sample_lists[1]),
        type: 'violin',
        points: 'none',
        box: {
          visible: true
        },
        line: {
          color: 'green',
        },
        meanline: {
          visible: true
        },
        name: sample_group_list[1],
        x0: sample_group_list[1]
    }
    var trace3 = {
        y: get_sample_vals(full_sample_lists[0]),
        type: 'violin',
        points: 'none',
        box: {
          visible: true
        },
        line: {
          color: 'green',
        },
        meanline: {
          visible: true
        },
        name: sample_group_list[0],
        x0: sample_group_list[0]
    }
    violin_data = [trace1, trace2, trace3]
} else {
    root.violin_layout = {
      title: "Violin Plot",
      yaxis: {
        range: [range_bottom, range_top],
        zeroline: false
      },
      width: 500,
      height: 300,
      margin: {
            l: 50,
            r: 30,
            t: 80,
            b: 80
      }
    };
    violin_data = [
      {
        y: get_sample_vals(full_sample_lists[0]),
        type: 'violin',
        points: 'none',
        box: {
          visible: true
        },
        line: {
          color: 'green',
        },
        meanline: {
          visible: true
        },
        name: sample_group_list[0],
        x0: sample_group_list[0]
      }
    ]
}

violin_obj = {
  data: violin_data,
  layout: root.violin_layout
}

$('.violin_plot_tab').click(function() {
  if ($('#violin_plot').hasClass('js-plotly-plot')){
    redraw_violin_plot();
  } else {
    Plotly.plot('violin_plot', violin_obj, root.modebar_options);
  }
});

// Histogram
var hist_trace = {
    x: get_sample_vals(sample_lists[0]),
    type: 'histogram'
};
var data = [hist_trace];
var layout = {
  bargap: 0.05,
  title: "Sample Values",
  xaxis: {title: "Value"},
  yaxis: {title: "Count"},
  margin: {
      l: 50,
      r: 30,
      t: 100,
      b: 60
  }
};

$('.histogram_tab').click(function() {
  if ($('#histogram').hasClass('js-plotly-plot')){
    redraw_histogram();
    update_histogram_width();
  } else {
    Plotly.newPlot('histogram', data, layout, root.modebar_options)
    update_histogram_width()
  }
});

$('.histogram_samples_group').val(root.stats_group);
$('.histogram_samples_group').change(function() {
  root.stats_group = $(this).val();
  return redraw_histogram();
});

if (get_sample_vals(sample_lists[0]).length < 256) {
  $('.bar_chart_samples_group').change(function() {
    root.stats_group = $(this).val();
    return redraw_bar_chart();
  });
  root.bar_sort = "name"
}
$('.sort_by_name').click(function() {
  root.bar_sort = "name"
  return redraw_bar_chart();
});
$('.sort_by_value').click(function() {
  root.bar_sort = "value"
  return redraw_bar_chart();
});

root.prob_plot_group = 'samples_primary';
$('.prob_plot_samples_group').val(root.prob_plot_group);
$('.prob_plot_tab').click(function() {
  return redraw_prob_plot();
});
$('.prob_plot_samples_group').change(function() {
  root.prob_plot_group = $(this).val();
  return redraw_prob_plot();
});

function isEmpty( el ){
  return !$.trim(el.html())
}

$('.stats_panel').click(function() {
  if (isEmpty($('#stats_table'))){
    make_table();
    edit_data_change();
  } else {
    edit_data_change();
  }
});
$('#edit_sample_lists').change(edit_data_change);
$('#block_by_index').click(edit_data_change);
$('#exclude_group').click(edit_data_change);
$('#block_outliers').click(edit_data_change);
$('#reset').click(edit_data_change);
$('#qnorm').click(edit_data_change);
$('#normalize').click(edit_data_change);

Number.prototype.countDecimals = function () {
  if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}