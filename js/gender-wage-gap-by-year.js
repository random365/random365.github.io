var vlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {"url": "data/oecd_gender_pay_gap2.csv"},

    title: {
        text: "OECD Gender Pay Gap - Year by Year",
        fontSize: 25,
        fontWeight: "bold",
        subtitle: "Move through time by using the scroll bar in the bottom left",
        subtitleFontStyle: "italic",
        subtitleFontSize: 20,
        dy: -25
    },
    width: 1600,
    height: 800,
    transform: [
        {
          lookup: 'LOCATION',
          from: {
            data: {
                url: "data/countries.csv",
            },
            key: "alpha-3",
            fields: ["name"]
        }  
        },
        {
            calculate: "datum['actual_gap'] / 100",
            as: "gpg_order"
        },
        {
            "calculate": "year(datum.TIME)",
            "as": "Year"
        },
        {
            "filter": {
                "selection": "Select"
            }
        },
        {
            calculate: "0.5 - datum['actual_gap']",
            as: "lower_x"
        },
        {
            calculate: "0.5 + (1 * datum['actual_gap'])",
            as: "upper_x"
        }
    ],
    layer: [
        {
            "selection": {
                "highlight": {"type": "single", "empty": "none", "on": "mouseover"},
                "select": {"type": "multi"},
                "Select": {
                    "type": "single",
                    "fields": ["Year"],
                    "init": {
                        "Year": 2018
                    },
                    "bind": {
                        "input": "range",
                        "min": 1970,
                        "max": 2018,
                        "step": 1,
                    }
                }
            },
            mark: {
                type: "bar",
                "stroke": "#70A280",
                // fill: {
                //     color: "blue"
                // },
                "cursor": "pointer"
            },
            encoding: {
                y: {
                    field: 'name',
                    type: 'nominal',
                    scale: {"padding": 0},
                    // band: 1.1,
                    axis: {
                        title: null,
                        grid: false,
                        ticks: true,
                        // labels: false
                    },
                    sort: {
                        field: 'gpg_order',
                        type: 'quantitative',
                        order: 'descending'
                    },
                },
                x: {
                    field: 'Unadjusted gender wage gap (%)',
                    type: 'quantitative',
                    axis: {title: null, labels: false, ticks: false, grid: false},
                    stack: 'normalize'
                },
                order: {
                    field: 'position',
                    type: 'quantitative',
                    sort: 'ascending'
                },
                color: {
                    field: 'position',
                    type: 'quantitative',
                    condition: {
                        test: "datum.position == 2",
                        value: "white"
                    },
                    scale: {
                        "type": "quantitative",
                        "domain": [1, 3],
                        "range": [ "#70A280", "#70A280"]
                    },
                    legend: false
                },
                tooltip: {
                    field: 'name',
                    type: 'nominal',
                    condition: {
                        test: "datum.position != 2",
                        value: ""
                    }
                },
                "fillOpacity": {
                    "condition": {"selection": "select", "value": 1},
                    "value": 0.3
                },
                "strokeWidth": {
                    "condition": [
                      {
                        "test": {
                          "and": [
                            {"selection": "select"},
                            "length(data(\"select_store\"))",
                            "datum.position == 2"
                          ]
                        },
                        "value": 2
                      },
                      {"selection": "highlight", "value": 1},
                      {
                          test: "datum.position != 2"
                      }
                    ],
                    "value": 0
                }
            }
        },
        {
            "mark": "rule",
            "encoding": {
              "x": {
                "aggregate": "mean",
                "field": "lower_x",
                "type": "quantitative",
              },
              "color": {"value": "red"},
              "size": {"value": 5},
            }
        },
        {
            "mark": "rule",
            "encoding": {
              "x": {
                "aggregate": "mean",
                "field": "upper_x",
                "type": "quantitative",
              },
              "color": {"value": "red"},
              "size": {"value": 5},
            }
        },
        {
            mark: {
                type: "text",
                align: "center",
                baseline: "bottom",
                fontSize: 22,
                font: "Monospace",
                // fontStyle: "bold",
                color: "red",
                dy: -420,
                dx: -47
            },
            encoding: {
                text: {
                field: "test",
                type: "nominal",
                }
            }
        },
        {
            mark: {
                type: "text",
                align: "center",
                baseline: "bottom",
                fontSize: 22,
                font: "Monospace",
                fontStyle: "bold",
                color: "red",
                dy: -420,
                dx: 107
            },
            encoding: {
                text: {
                    aggregate: "mean",
                    field: "actual_gap",
                    type: "quantitative",
                    format: ".2%"
                },
            }
        }, 
        {
            mark: {
                type: "text",
                align: "center",
                baseline: "middle",
                dx: 0,
                // dy: -17,
                color: "#70A280",
                // fontStyle: "bold",
                fontSize: 16,
                font: "Monospace"
            },
            encoding: {
                text: {
                    field: 'actual_gap',
                    type: 'quantitative',
                    "format": ".2%",
                    condition: {
                        test: "datum.position != 1",
                        value: ""
                    },
                    
                },
                y: {
                    field: 'name',
                    type: 'nominal',
                    // scale: {"padding": 0},
                    // band: 1.1,
                    sort: {
                        field: 'gpg_order',
                        type: 'quantitative',
                        order: 'descending'
                    },
                },
                x: {
                    field: 'position',
                    type: 'quantitative',
                    stack: 'normalize'
                },
                "fillOpacity": {
                    "condition": {"selection": "select", "value": 1},
                    "value": 0.3
                },
                "strokeWidth": {
                    "condition": [
                      {
                        "test": {
                          "and": [
                            {"selection": "select"},
                            "length(data(\"select_store\"))"
                          ]
                        },
                        "value": 2
                      },
                      {"selection": "highlight", "value": 1}
                    ],
                    "value": 0
                }
            }
            }
    ]
    };

// Embed the visualization in the container with id `vis`
vegaEmbed('#vis6', vlSpec);