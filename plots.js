function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      //console.log(sampleNames.length);
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);

  }

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(key + " : " + value);
    });
   });
}

function buildBarChart(sample){
    d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otu_ids_arr = result.otu_ids;
    var otu_labels_arr = result.otu_labels;
    var sample_values_arr = result.sample_values;
    var dict = {}

    // Create a dictionary containing all the otu_id info
    for (let i = 0; i < otu_labels_arr.length; i++){
        dict[i] = [otu_labels_arr[i],sample_values_arr[i], otu_ids_arr[i]];
    }

    // Create an array containing all the otu_id info
    var items = Object.keys(dict).map(function(key){
        return[key, dict[key][0], dict[key][1], dict[key][2]];
    });

    // Sort the array for sample_values in Descending order
    items.sort(function(first, second){
        return second[2]-first[2];
    });

    // Select the top 10 sample_values for plotting
    var plot_material = [];
    plot_material = items.slice(0,10);

    var plot_values = [];
    var plot_labels = [];
    var plot_description = [];

    // Create BarChart elements
    plot_material.forEach(function(item){
        plot_description.push(item[1]);
        plot_values.push(item[2]);
        plot_labels.push("OTU "+item[3]);
    });

    // Create BarChart
    var trace = {
        y: plot_labels.reverse(),
        x: plot_values.reverse(),
        text: plot_description.reverse().map(a => a.split(';').join(',<br>')),
        hoverinfo: 'text',
        type: "bar",
        orientation: 'h'
       };
    var data_bar = [trace];
    var layout = {
        annotation: {align: 'left'},
    };
    Plotly.newPlot("bar", data_bar, layout);
});
}


function buildBubbleChart(sample){
    d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otu_ids_arr = result.otu_ids;
    var otu_labels_arr = result.otu_labels;
    var sample_values_arr = result.sample_values;
    var dict = {}

    // Create BarChart
    var trace = {
        x: otu_ids_arr,
        y: sample_values_arr,
        mode: 'markers',
        marker: {
            size: sample_values_arr,
            color: otu_ids_arr,
            colorscale: [[0, 'rgb(0, 0, 255)'], [1, 'rgb(150,75,0)']],
        },
        text: otu_labels_arr.map(a => a.split(';').join(',<br>')),
        hoverinfo: 'text',
       };
    var data_bar = [trace];
    var layout = {
        annotation: {align: 'left'},
        xaxis: { title: "OTU ID"},
    };
    Plotly.newPlot("bubble", data_bar, layout);
});
}


init();
