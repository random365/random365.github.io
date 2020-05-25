var vlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {"url": "data/oecd_gender_pay_gap_2016.csv"},

    title: {
        text: "OECD Gender Pay Gap - 2016",
        fontSize: 20,
        fontWeight: "bold",
        subtitle: "Hover over each gap for further details",
        subtitleFontStyle: "italic",
        subtitleFontSize: 14
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
        }
    ],
    layer: [
        {
            "selection": {
                "highlight": {"type": "single", "empty": "none", "on": "mouseover"},
                "select": {"type": "multi"}
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
            mark: {
                type: "text",
                align: "center",
                baseline: "middle",
                dx: 0,
                // dy: -17,
                color: "#70A280",
                fontStyle: "bold",
                fontSize: 14
            },
            encoding: {
                text: {
                    field: 'actual_gap',
                    type: 'quantitative',
                    "format": ".2%",
                    condition: {
                        test: "datum.position != 2",
                        value: ""
                    }
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
vegaEmbed('#vis5', vlSpec);