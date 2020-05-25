var vlSpec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "background": "white",
    "padding": 5,
    "width": 1600,
    "height": 800,
    "title": {
      "text": "OECD Gender Pay Gap - Year by Year",
      "fontSize": 25,
      "fontWeight": "bold",
      "subtitle": "Move through time by using the scroll bar in the bottom left",
      "subtitleFontStyle": "italic",
      "subtitleFontSize": 20,
      "dy": -25,
      "frame": "group"
    },
    "style": "cell",
    "data": [
      {"name": "highlight_store"},
      {"name": "select_store"},
      {
        "name": "Select_store",
        "values": [
          {
            "unit": "layer_0",
            "fields": [{"type": "E", "field": "Year"}],
            "values": [2018]
          }
        ]
      },
      {
        "name": "source_1",
        "url": "data/countries.csv",
        "format": {"type": "csv", "delimiter": ","}
      },
      {
        "name": "source_0",
        "url": "data/oecd_gender_pay_gap2.csv",
        "format": {"type": "csv", "delimiter": ","},
        "transform": [
          {"type": "identifier", "as": "_vgsid_"},
          {
            "type": "lookup",
            "from": "source_1",
            "key": "alpha-3",
            "fields": ["LOCATION"],
            "values": ["name"]
          },
          {
            "type": "formula",
            "expr": "datum['actual_gap'] / 100",
            "as": "gpg_order"
          },
          {"type": "formula", "expr": "year(datum.TIME)", "as": "Year"},
          {
            "type": "filter",
            "expr": "!(length(data(\"Select_store\"))) || (vlSelectionTest(\"Select_store\", datum))"
          },
          {
            "type": "formula",
            "expr": "0.5 - datum['actual_gap']",
            "as": "lower_x"
          },
          {
            "type": "formula",
            "expr": "0.5 + (1 * datum['actual_gap'])",
            "as": "upper_x"
          }
        ]
      },
      {
        "name": "data_1",
        "source": "source_0",
        "transform": [
          {
            "type": "stack",
            "groupby": ["name"],
            "field": "Unadjusted gender wage gap (%)",
            "sort": {"field": ["position"], "order": ["ascending"]},
            "as": [
              "Unadjusted gender wage gap (%)_start",
              "Unadjusted gender wage gap (%)_end"
            ],
            "offset": "normalize"
          },
          {
            "type": "filter",
            "expr": "isValid(datum[\"Unadjusted gender wage gap (%)\"]) && isFinite(+datum[\"Unadjusted gender wage gap (%)\"]) && isValid(datum[\"position\"]) && isFinite(+datum[\"position\"])"
          }
        ]
      },
      {
        "name": "data_2",
        "source": "source_0",
        "transform": [
          {
            "type": "aggregate",
            "groupby": [],
            "ops": ["mean", "mean", "mean"],
            "fields": ["actual_gap", "lower_x", "upper_x"],
            "as": ["mean_actual_gap", "mean_lower_x", "mean_upper_x"]
          }
        ]
      },
      {
        "name": "data_3",
        "source": "data_2",
        "transform": [
          {
            "type": "filter",
            "expr": "isValid(datum[\"mean_lower_x\"]) && isFinite(+datum[\"mean_lower_x\"])"
          }
        ]
      },
      {
        "name": "data_4",
        "source": "data_2",
        "transform": [
          {
            "type": "filter",
            "expr": "isValid(datum[\"mean_upper_x\"]) && isFinite(+datum[\"mean_upper_x\"])"
          }
        ]
      },
      {
        "name": "data_5",
        "source": "source_0",
        "transform": [
          {
            "type": "stack",
            "groupby": ["name"],
            "field": "position",
            "sort": {"field": ["actual_gap"], "order": ["ascending"]},
            "as": ["position_start", "position_end"],
            "offset": "normalize"
          },
          {
            "type": "filter",
            "expr": "isValid(datum[\"position\"]) && isFinite(+datum[\"position\"])"
          }
        ]
      }
    ],
    "signals": [
      {
        "name": "unit",
        "value": {},
        "on": [
          {"events": "mousemove", "update": "isTuple(group()) ? group() : unit"}
        ]
      },
      {
        "name": "Year",
        "init": "2018",
        "bind": {"input": "range", "min": 1970, "max": 2018, "step": 1}
      },
      {
        "name": "highlight",
        "update": "vlSelectionResolve(\"highlight_store\", \"union\")"
      },
      {
        "name": "select",
        "update": "vlSelectionResolve(\"select_store\", \"union\", true)"
      },
      {
        "name": "Select",
        "update": "vlSelectionResolve(\"Select_store\", \"union\")"
      },
      {
        "name": "highlight_tuple",
        "on": [
          {
            "events": [{"source": "scope", "type": "mouseover"}],
            "update": "datum && item().mark.marktype !== 'group' ? {unit: \"layer_0\", fields: highlight_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)[\"_vgsid_\"]]} : null",
            "force": true
          },
          {"events": [{"source": "scope", "type": "dblclick"}], "update": "null"}
        ]
      },
      {
        "name": "highlight_tuple_fields",
        "value": [{"type": "E", "field": "_vgsid_"}]
      },
      {
        "name": "highlight_modify",
        "on": [
          {
            "events": {"signal": "highlight_tuple"},
            "update": "modify(\"highlight_store\", highlight_tuple, true)"
          }
        ]
      },
      {
        "name": "select_tuple",
        "on": [
          {
            "events": [{"source": "scope", "type": "click"}],
            "update": "datum && item().mark.marktype !== 'group' ? {unit: \"layer_0\", fields: select_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)[\"_vgsid_\"]]} : null",
            "force": true
          },
          {"events": [{"source": "scope", "type": "dblclick"}], "update": "null"}
        ]
      },
      {
        "name": "select_tuple_fields",
        "value": [{"type": "E", "field": "_vgsid_"}]
      },
      {
        "name": "select_toggle",
        "value": false,
        "on": [
          {
            "events": [{"source": "scope", "type": "click"}],
            "update": "event.shiftKey"
          },
          {"events": [{"source": "scope", "type": "dblclick"}], "update": "false"}
        ]
      },
      {
        "name": "select_modify",
        "on": [
          {
            "events": {"signal": "select_tuple"},
            "update": "modify(\"select_store\", select_toggle ? null : select_tuple, select_toggle ? null : true, select_toggle ? select_tuple : null)"
          }
        ]
      },
      {
        "name": "Select_tuple",
        "update": "Year !== null ? {fields: Select_tuple_fields, values: [Year]} : null"
      },
      {"name": "Select_tuple_fields", "value": [{"type": "E", "field": "Year"}]},
      {
        "name": "Select_modify",
        "on": [
          {
            "events": {"signal": "Select_tuple"},
            "update": "modify(\"Select_store\", Select_tuple, true)"
          }
        ]
      }
    ],
    "marks": [
      {
        "name": "layer_0_marks",
        "type": "rect",
        "style": ["bar"],
        "interactive": true,
        "from": {"data": "data_1"},
        "encode": {
          "update": {
            "stroke": {"value": "#70A280"},
            "cursor": {"value": "pointer"},
            "fill": [
              {"test": "datum.position == 2", "value": "white"},
              {"scale": "color", "field": "position"}
            ],
            "fillOpacity": [
              {
                "test": "!(length(data(\"select_store\"))) || (vlSelectionTest(\"select_store\", datum))",
                "value": 1
              },
              {"value": 0.3}
            ],
            "strokeWidth": [
              {
                "test": "(!(length(data(\"select_store\"))) || (vlSelectionTest(\"select_store\", datum))) && (length(data(\"select_store\"))) && (datum.position == 2)",
                "value": 2
              },
              {
                "test": "(vlSelectionTest(\"highlight_store\", datum))",
                "value": 1
              },
              {"test": "datum.position != 2"},
              {"value": 0}
            ],
            "tooltip": [
              {"test": "datum.position != 2", "value": ""},
              {
                "signal": "isValid(datum[\"name\"]) ? datum[\"name\"] : \"\"+datum[\"name\"]"
              }
            ],
            "ariaRoleDescription": {"value": "bar"},
            "description": {
              "signal": "\"name\" + \": \" + (isValid(datum[\"name\"]) ? datum[\"name\"] : \"\"+datum[\"name\"]) + \"; \" + \"Unadjusted gender wage gap (%)\" + \": \" + (format(datum[\"Unadjusted gender wage gap (%)_end\"]-datum[\"Unadjusted gender wage gap (%)_start\"], \"\")) + \"; \" + \"position\" + \": \" + (format(datum[\"position\"], \"\"))"
            },
            "x": {"scale": "x", "field": "Unadjusted gender wage gap (%)_end"},
            "x2": {"scale": "x", "field": "Unadjusted gender wage gap (%)_start"},
            "y": {"scale": "y", "field": "name"},
            "height": {"scale": "y", "band": 1}
          }
        }
      },
      {
        "name": "layer_1_marks",
        "type": "rule",
        "style": ["rule"],
        "interactive": false,
        "from": {"data": "data_3"},
        "encode": {
          "update": {
            "stroke": {"value": "red"},
            "description": {
              "signal": "\"Mean of lower_x\" + \": \" + (format(datum[\"mean_lower_x\"], \"\"))"
            },
            "x": {"scale": "x", "field": "mean_lower_x"},
            "y": {"value": 0},
            "y2": {"field": {"group": "height"}},
            "strokeWidth": {"value": 5}
          }
        }
      },
      {
        "name": "layer_2_marks",
        "type": "rule",
        "style": ["rule"],
        "interactive": false,
        "from": {"data": "data_4"},
        "encode": {
          "update": {
            "stroke": {"value": "red"},
            "description": {
              "signal": "\"Mean of upper_x\" + \": \" + (format(datum[\"mean_upper_x\"], \"\"))"
            },
            "x": {"scale": "x", "field": "mean_upper_x"},
            "y": {"value": 0},
            "y2": {"field": {"group": "height"}},
            "strokeWidth": {"value": 5}
          }
        }
      },
      {
        "name": "layer_3_marks",
        "type": "text",
        "style": ["text"],
        "interactive": false,
        "from": {"data": "source_0"},
        "encode": {
          "update": {
            "align": {"value": "center"},
            "baseline": {"value": "bottom"},
            "dx": {"value": -47},
            "dy": {"value": -420},
            "font": {"value": "Monospace"},
            "fontSize": {"value": 22},
            "fill": {"value": "red"},
            "description": {
              "signal": "\"test\" + \": \" + (isValid(datum[\"test\"]) ? datum[\"test\"] : \"\"+datum[\"test\"])"
            },
            "x": {"signal": "width", "mult": 0.5},
            "y": {"signal": "height", "mult": 0.5},
            "text": {
              "signal": "isValid(datum[\"test\"]) ? datum[\"test\"] : \"\"+datum[\"test\"]"
            }
          }
        }
      },
      {
        "name": "layer_4_marks",
        "type": "text",
        "style": ["text"],
        "interactive": false,
        "from": {"data": "data_2"},
        "encode": {
          "update": {
            "align": {"value": "center"},
            "baseline": {"value": "bottom"},
            "dx": {"value": 107},
            "dy": {"value": -420},
            "font": {"value": "Monospace"},
            "fontSize": {"value": 22},
            "fontStyle": {"value": "bold"},
            "fill": {"value": "red"},
            "description": {
              "signal": "\"Mean of actual_gap\" + \": \" + (format(datum[\"mean_actual_gap\"], \".2%\"))"
            },
            "x": {"signal": "width", "mult": 0.5},
            "y": {"signal": "height", "mult": 0.5},
            "text": {"signal": "format(datum[\"mean_actual_gap\"], \".2%\")"}
          }
        }
      },
      {
        "name": "layer_5_marks",
        "type": "text",
        "style": ["text"],
        "interactive": false,
        "from": {"data": "data_5"},
        "encode": {
          "update": {
            "align": {"value": "center"},
            "baseline": {"value": "middle"},
            "dx": {"value": 0},
            "font": {"value": "Monospace"},
            "fontSize": {"value": 16},
            "fill": {"value": "#70A280"},
            "fillOpacity": [
              {
                "test": "!(length(data(\"select_store\"))) || (vlSelectionTest(\"select_store\", datum))",
                "value": 1
              },
              {"value": 0.3}
            ],
            "strokeWidth": [
              {
                "test": "(!(length(data(\"select_store\"))) || (vlSelectionTest(\"select_store\", datum))) && (length(data(\"select_store\")))",
                "value": 2
              },
              {
                "test": "(vlSelectionTest(\"highlight_store\", datum))",
                "value": 1
              },
              {"value": 0}
            ],
            "description": {
              "signal": "\"actual_gap\" + \": \" + (format(datum[\"actual_gap\"], \".2%\")) + \"; \" + \"name\" + \": \" + (isValid(datum[\"name\"]) ? datum[\"name\"] : \"\"+datum[\"name\"]) + \"; \" + \"position\" + \": \" + (format(datum[\"position_end\"]-datum[\"position_start\"], \"\"))"
            },
            "x": {"scale": "x", "field": "position_end"},
            "y": {"scale": "y", "field": "name", "band": 0.5},
            "text": [
              {"test": "datum.position != 1", "value": ""},
              {"signal": "format(datum[\"actual_gap\"], \".2%\")"}
            ]
          }
        }
      }
    ],
    "scales": [
      {
        "name": "x",
        "type": "linear",
        "domain": {
          "fields": [
            [0, 1],
            {"data": "data_3", "field": "mean_lower_x"},
            {"data": "data_4", "field": "mean_upper_x"}
          ]
        },
        "range": [0, {"signal": "width"}],
        "nice": true,
        "zero": true
      },
      {
        "name": "y",
        "type": "band",
        "domain": {
          "data": "source_0",
          "field": "name",
          "sort": {"op": "sum", "field": "gpg_order", "order": "descending"}
        },
        "range": [0, {"signal": "height"}],
        "padding": 0
      },
      {
        "name": "color",
        "type": "linear",
        "domain": [1, 3],
        "range": ["#70A280", "#70A280"],
        "interpolate": "hcl",
        "zero": false
      }
    ],
    "axes": [
      {
        "scale": "x",
        "orient": "bottom",
        "grid": false,
        "labels": false,
        "ticks": false,
        "labelFlush": true,
        "labelOverlap": true,
        "tickCount": {"signal": "ceil(width/40)"},
        "zindex": 0
      },
      {"scale": "y", "orient": "left", "grid": false, "ticks": true, "zindex": 0}
    ]
  };

// Embed the visualization in the container with id `vis`
vegaEmbed('#vis6', vlSpec);