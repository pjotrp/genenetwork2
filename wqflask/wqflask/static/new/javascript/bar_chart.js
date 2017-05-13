// Generated by CoffeeScript 1.9.2
(function() {
  var Bar_Chart, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Bar_Chart = (function() {
    function Bar_Chart(sample_lists) {
      this.add_legend_discrete = bind(this.add_legend_discrete, this);
      this.add_legend_continuous = bind(this.add_legend_continuous, this);
      this.remove_legend = bind(this.remove_legend, this);
      this.add_legend = bind(this.add_legend, this);
      var key, l1, l1_names, l2, l3, longest_sample_name_len, s, sample, x;
      this.sample_lists = {};
      l1 = this.sample_lists['samples_primary'] = sample_lists[0] || [];
      l2 = this.sample_lists['samples_other'] = sample_lists[1] || [];
      l1_names = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = l1.length; j < len; j++) {
          x = l1[j];
          results.push(x.name);
        }
        return results;
      })();
      l3 = l1.concat((function() {
        var j, len, ref, results;
        results = [];
        for (j = 0, len = l2.length; j < len; j++) {
          x = l2[j];
          if (ref = x.name, indexOf.call(l1_names, ref) < 0) {
            results.push(x);
          }
        }
        return results;
      })());
      this.sample_lists['samples_all'] = l3;
      longest_sample_name_len = d3.max((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = l3.length; j < len; j++) {
          sample = l3[j];
          results.push(sample.name.length);
        }
        return results;
      })());
      this.margin = {
        top: 20,
        right: 20,
        bottom: longest_sample_name_len * 6,
        left: 40
      };
      this.attributes = (function() {
        var results;
        results = [];
        for (key in sample_lists[0][0]["extra_attributes"]) {
          results.push(key);
        }
        return results;
      })();
      this.sample_attr_vals = (function() {
        var j, len, ref, results;
        ref = this.sample_lists['samples_all'];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          s = ref[j];
          if (s.value !== null) {
            results.push(this.extra(s));
          }
        }
        return results;
      }).call(this);
      this.get_distinct_attr_vals();
      this.get_attr_color_dict(this.distinct_attr_vals);
      this.attribute_name = "None";
      this.sort_by = "name";
      this.chart = null;
      this.select_attribute_box = $("#color_attribute");
      d3.select("#color_attribute").on("change", (function(_this) {
        return function() {
          _this.attribute_name = _this.select_attribute_box.val();
          return _this.rebuild_bar_graph();
        };
      })(this));
      $(".sort_by_value").on("click", (function(_this) {
        return function() {
          console.log("sorting by value");
          _this.sort_by = "value";
          return _this.rebuild_bar_graph();
        };
      })(this));
      $(".sort_by_name").on("click", (function(_this) {
        return function() {
          console.log("sorting by name");
          _this.sort_by = "name";
          return _this.rebuild_bar_graph();
        };
      })(this));
      d3.select("#color_by_trait").on("click", (function(_this) {
        return function() {
          return _this.open_trait_selection();
        };
      })(this));
    }

    Bar_Chart.prototype.value = function(sample) {
      return this.value_dict[sample.name].value;
    };

    Bar_Chart.prototype.variance = function(sample) {
      return this.value_dict[sample.name].variance;
    };

    Bar_Chart.prototype.extra = function(sample) {
      var attr_vals, attribute, j, len, ref;
      attr_vals = {};
      ref = this.attributes;
      for (j = 0, len = ref.length; j < len; j++) {
        attribute = ref[j];
        attr_vals[attribute] = sample["extra_attributes"][attribute];
      }
      return attr_vals;
    };

    Bar_Chart.prototype.redraw = function(samples_dict, selected_group) {
      var x;
      this.value_dict = samples_dict[selected_group];
      this.raw_data = (function() {
        var j, len, ref, results;
        ref = this.sample_lists[selected_group];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          x = ref[j];
          if (x.name in this.value_dict && this.value(x) !== null) {
            results.push(x);
          }
        }
        return results;
      }).call(this);
      return this.rebuild_bar_graph();
    };

    Bar_Chart.prototype.rebuild_bar_graph = function() {
      var container, h, raw_data;
      raw_data = this.raw_data.slice();
      if (this.sort_by === 'value') {
        raw_data = raw_data.sort((function(_this) {
          return function(x, y) {
            return _this.value(x) - _this.value(y);
          };
        })(this));
      }
      console.log("raw_data: ", raw_data);
      h = 600;
      container = $("#bar_chart_container");
      container.height(h + this.margin.top + this.margin.bottom);
      if (this.chart === null) {
        this.chart = nv.models.multiBarChart().height(h).errorBarColor((function(_this) {
          return function() {
            return 'red';
          };
        })(this)).reduceXTicks(false).staggerLabels(false).showControls(false).showLegend(false);
        this.chart.multibar.dispatch.on('elementMouseover.tooltip', (function(_this) {
          return function(evt) {
            var k, ref, v;
            evt.value = _this.chart.x()(evt.data);
            evt['series'] = [
              {
                key: 'Value',
                value: evt.data.y,
                color: evt.color
              }
            ];
            if (evt.data.yErr) {
              evt['series'].push({
                key: 'SE',
                value: evt.data.yErr
              });
            }
            if (evt.data.attr) {
              ref = evt.data.attr;
              for (k in ref) {
                v = ref[k];
                evt['series'].push({
                  key: k,
                  value: v
                });
              }
            }
            return _this.chart.tooltip.data(evt).hidden(false);
          };
        })(this));
        this.chart.tooltip.valueFormatter(function(d, i) {
          return d;
        });
      }
      return nv.addGraph((function(_this) {
        return function() {
          var d, s, values;
          _this.remove_legend();
          values = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = raw_data.length; j < len; j++) {
              s = raw_data[j];
              results.push({
                x: s.name,
                y: this.value(s),
                yErr: this.variance(s) || 0,
                attr: s.extra_attributes
              });
            }
            return results;
          }).call(_this);
          if (_this.attribute_name !== "None") {
            _this.color_dict = _this.attr_color_dict[_this.attribute_name];
            _this.chart.barColor(function(d) {
              return _this.color_dict[d.attr[_this.attribute_name]];
            });
            _this.add_legend();
          } else if (typeof _this.trait_color_dict !== 'undefined') {
            _this.color_dict = _this.trait_color_dict;
            _this.chart.barColor(function(d) {
              return _this.color_dict[d['x']];
            });
          } else {
            _this.chart.barColor(function() {
              return 'steelblue';
            });
          }
          _this.chart.width(raw_data.length * 20);
          //User should be able to change Y domain, but should still have good default
          _this.chart.yDomain([
            0.95 * _.min((function() { // ZS: Decreasing this constant decreases the min Y axis value
              var j, len, results;
              results = [];
              for (j = 0, len = values.length; j < len; j++) {
                d = values[j];
                results.push(d.y - 0.5 * d.yErr); //ZS: the 0.5 was originally 1.5
              }
              return results;
            })()), 1.05 * _.max((function() { // ZS: Decreasing this constant decreases the max Y axis value
              var j, len, results;
              results = [];
              for (j = 0, len = values.length; j < len; j++) {
                d = values[j];
                results.push(d.y + 0.5 * d.yErr); // //ZS: the 0.5 was originally 1.5
              }
              return results;
            })())
          ]);
          console.log("values: ", values);

          decimal_exists = "False";
          for(i=0; i < values.length; i++){
              if (values[i]['y'] % 1 != 0){
                  decimal_exists = "True";
                  break;
              }
          }
          if (decimal_exists == "False"){
              _this.chart.yAxis.tickFormat(d3.format('d'))
          }
          d3.select("#bar_chart_container svg").datum([
            {
              values: values
            }
          ]).style('width', raw_data.length * 20 + 'px').transition().duration(1000).call(_this.chart);
          d3.select("#bar_chart_container .nv-x").selectAll('.tick text').style("font-size", "12px").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.3em").attr("transform", function(d) {
            return "rotate(-90)";
          });
          return _this.chart;
        };
      })(this));
    };

    Bar_Chart.prototype.get_attr_color_dict = function(vals) {
      var color, color_range, discrete, distinct_vals, i, j, key, l, len, len1, results, this_color_dict, value;
      this.attr_color_dict = {};
      this.is_discrete = {};
      this.minimum_values = {};
      this.maximum_values = {};
      console.log("vals:", vals);
      results = [];
      for (key in vals) {
        if (!hasProp.call(vals, key)) continue;
        distinct_vals = vals[key];
        this.min_val = d3.min(distinct_vals);
        this.max_val = d3.max(distinct_vals);
        this_color_dict = {};
        discrete = distinct_vals.length < 10;
        if (discrete) {
          color = d3.scale.category10();
          for (i = j = 0, len = distinct_vals.length; j < len; i = ++j) {
            value = distinct_vals[i];
            this_color_dict[value] = color(i);
          }
        } else {
          console.log("distinct_values:", distinct_vals);
          if (_.every(distinct_vals, (function(_this) {
            return function(d) {
              if (isNaN(d)) {
                return false;
              } else {
                return true;
              }
            };
          })(this))) {
            color_range = d3.scale.linear().domain([this.min_val, this.max_val]).range([0, 255]);
            for (i = l = 0, len1 = distinct_vals.length; l < len1; i = ++l) {
              value = distinct_vals[i];
              console.log("color_range(value):", parseInt(color_range(value)));
              this_color_dict[value] = d3.rgb(parseInt(color_range(value)), 0, 0);
            }
          }
        }
        this.attr_color_dict[key] = this_color_dict;
        this.is_discrete[key] = discrete;
        this.minimum_values[key] = this.min_val;
        results.push(this.maximum_values[key] = this.max_val);
      }
      return results;
    };

    Bar_Chart.prototype.get_distinct_attr_vals = function() {
      var attribute, j, len, ref, results, sample;
      this.distinct_attr_vals = {};
      ref = this.sample_attr_vals;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        sample = ref[j];
        results.push((function() {
          var ref1, results1;
          results1 = [];
          for (attribute in sample) {
            if (!this.distinct_attr_vals[attribute]) {
              this.distinct_attr_vals[attribute] = [];
            }
            if (ref1 = sample[attribute], indexOf.call(this.distinct_attr_vals[attribute], ref1) < 0) {
              results1.push(this.distinct_attr_vals[attribute].push(sample[attribute]));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Bar_Chart.prototype.add_legend = function() {
      if (this.is_discrete[this.attribute_name]) {
        return this.add_legend_discrete();
      } else {
        return this.add_legend_continuous();
      }
    };

    Bar_Chart.prototype.remove_legend = function() {
      $(".legend").remove();
      return $("#legend-left,#legend-right,#legend-colors").empty();
    };

    Bar_Chart.prototype.add_legend_continuous = function() {
      var svg_html;
      $('#legend-left').html(this.minimum_values[this.attribute_name]);
      $('#legend-right').html(this.maximum_values[this.attribute_name]);
      svg_html = '<svg height="15" width="120"> <rect x="0" width="20" height="15" style="fill: rgb(0, 0, 0);"></rect> <rect x="20" width="20" height="15" style="fill: rgb(50, 0, 0);"></rect> <rect x="40" width="20" height="15" style="fill: rgb(100, 0, 0);"></rect> <rect x="60" width="20" height="15" style="fill: rgb(150, 0, 0);"></rect> <rect x="80" width="20" height="15" style="fill: rgb(200, 0, 0);"></rect> <rect x="100" width="20" height="15" style="fill: rgb(255, 0, 0);"></rect> </svg>';
      console.log("svg_html:", svg_html);
      return $('#legend-colors').html(svg_html);
    };

    Bar_Chart.prototype.add_legend_discrete = function() {
      var legend_span;
      legend_span = d3.select('#bar_chart_legend').append('div').style('word-wrap', 'break-word').attr('class', 'legend').selectAll('span').data(this.distinct_attr_vals[this.attribute_name]).enter().append('span').style({
        'word-wrap': 'normal',
        'display': 'inline-block'
      });
      legend_span.append('span').style("background-color", (function(_this) {
        return function(d) {
          return _this.attr_color_dict[_this.attribute_name][d];
        };
      })(this)).style({
        'display': 'inline-block',
        'width': '15px',
        'height': '15px',
        'margin': '0px 5px 0px 15px'
      });
      return legend_span.append('span').text((function(_this) {
        return function(d) {
          return d;
        };
      })(this)).style('font-size', '20px');
    };

    Bar_Chart.prototype.open_trait_selection = function() {
      return $('#collections_holder').load('/collections/list?color_by_trait #collections_list', (function(_this) {
        return function() {
          $.colorbox({
            inline: true,
            href: "#collections_holder"
          });
          return $('a.collection_name').attr('onClick', 'return false');
        };
      })(this));
    };

    Bar_Chart.prototype.color_by_trait = function(trait_sample_data) {
      var distinct_values, trimmed_samples;
      console.log("BXD1:", trait_sample_data["BXD1"]);
      console.log("trait_sample_data:", trait_sample_data);
      trimmed_samples = this.trim_values(trait_sample_data);
      distinct_values = {};
      distinct_values["collection_trait"] = this.get_distinct_values(trimmed_samples);
      this.trait_color_dict = this.get_trait_color_dict(trimmed_samples, distinct_values);
      console.log("TRAIT_COLOR_DICT:", this.trait_color_dict);
      return this.rebuild_bar_graph();
      //return console.log("SAMPLES:", this.samples);
    };

    Bar_Chart.prototype.trim_values = function(trait_sample_data) {
      var j, len, ref, sample, trimmed_samples;
      trimmed_samples = {};
      ref = this.sample_lists['samples_all'];
      for (j = 0, len = ref.length; j < len; j++) {
        sample = ref[j]['name'];
        if (sample in trait_sample_data) {
          trimmed_samples[sample] = trait_sample_data[sample];
        }
      }
      console.log("trimmed_samples:", trimmed_samples);
      return trimmed_samples;
    };

    Bar_Chart.prototype.get_distinct_values = function(samples) {
      var distinct_values;
      distinct_values = _.uniq(_.values(samples));
      console.log("distinct_values:", distinct_values);
      return distinct_values;
    };

    Bar_Chart.prototype.get_trait_color_dict = function(samples, vals) {
      var color, color_range, distinct_vals, i, j, k, key, len, len1, results, sample, this_color_dict, value;
      trait_color_dict = {};
      console.log("vals:", vals);
      for (key in vals) {
        if (!hasProp.call(vals, key)) continue;
        distinct_vals = vals[key];
        this_color_dict = {};
        this.min_val = d3.min(distinct_vals);
        this.max_val = d3.max(distinct_vals);
        if (distinct_vals.length < 10) {
          color = d3.scale.category10();
          for (i = j = 0, len = distinct_vals.length; j < len; i = ++j) {
            value = distinct_vals[i];
            this_color_dict[value] = color(i);
          }
        } else {
          console.log("distinct_values:", distinct_vals);
          if (_.every(distinct_vals, (function(_this) {
            return function(d) {
              if (isNaN(d)) {
                return false;
              } else {
                return true;
              }
            };
          })(this))) {
            color_range = d3.scale.linear().domain([d3.min(distinct_vals), d3.max(distinct_vals)]).range([0, 255]);
            for (i = k = 0, len1 = distinct_vals.length; k < len1; i = ++k) {
              value = distinct_vals[i];
              //console.log("color_range(value):", parseInt(color_range(value)));
              this_color_dict[value] = d3.rgb(parseInt(color_range(value)), 0, 0);
            }
          }
        }
      }
      results = [];
      console.log("SAMPLES:", samples)
      for (sample in samples) {
        if (!hasProp.call(samples, sample)) continue;
        value = samples[sample];
        trait_color_dict[sample] = this_color_dict[value];
        //results.push(this.trait_color_dict[sample] = this_color_dict[value]);
      }
      return trait_color_dict;
    };

    return Bar_Chart;

  })();

  root.Bar_Chart = Bar_Chart;

}).call(this);
