<!DOCTYPE html>
<meta charset="utf-8">

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>

<p>
  <label># bins</label>
  <input type="number" min="1" max="100" step="30" value="20" id="nBin">
</p>

<script>

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {

  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Y axis: initialization
  var y = d3.scaleLinear()
      .range([height, 0]);
  var yAxis = svg.append("g")

  // A function that builds the graph for a specific value of bin
  function update(nBin) {

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.price; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(nBin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: update now that we know the domain
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    // Join the rect with the bins data
    var u = svg.selectAll("rect")
        .data(bins)

    // Manage the existing bars and eventually the new ones:
    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")


    // If less bar in the new histogram, I delete the ones not in use anymore
    u
        .exit()
        .remove()

    }


  // Initialize with 20 bins
  update(20)


  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function() {
    update(+this.value);
  });

});
</script>



// var svgWidth = 960;
// var svgHeight = 500;

// var margin = {
//     top: 20,
//     right: 40,
//     bottom: 80,
//     left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// var svg = d3.select("#myAreaChart")
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

// // Append an SVG group
// var chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial Params
// var chosenXAxis = "healthcare";
// var chosenYAxis = "poverty";

// // function used for updating x-scale var upon click on axis label
// function xScale(stateData, chosenXAxis) {
//     // create scales
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
//             d3.max(stateData, d => d[chosenXAxis]) * 1.2
//         ])
//         .range([0, width]);

//     return xLinearScale;

// }

// // function used for updating y-scale var upon click on axis label
// function yScale(stateData, chosenYAxis) {
//     // create scales
//     var yLinearScale = d3.scaleLinear()
//         .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
//             d3.max(stateData, d => d[chosenYAxis]) * 1.2
//         ])
//         .range([height, 0]);

//     return yLinearScale;

// }

// // function used for updating xAxis var upon click on axis label
// function renderXAxis(newXScale, xAxis) {
//     var bottomAxis = d3.axisBottom(newXScale);

//     xAxis.transition()
//         .duration(1000)
//         .call(bottomAxis);


//     return xAxis;
// }

// // function used for updating yAxis var upon click on axis label
// function renderYAxis(newYScale, yAxis) {
//     var leftAxis = d3.axisLeft(newYScale);

//     yAxis.transition()
//         .duration(1000)
//         .call(leftAxis);

//     return yAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => newXScale(d[chosenXAxis]))
//         .attr("cy", d => newYScale(d[chosenYAxis]));

//     return circlesGroup;
// }

// function renderLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {
//     circleLabels.transition()
//         .duration(1000)
//         .attr("x", d => newXScale(d[chosenXAxis]))
//         .attr("y", d => newYScale(d[chosenYAxis]));

//     return circleLabels;
// }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

//     var xLabel;

//     if (chosenXAxis === "poverty") {
//         xLabel = "Poverty";
//     } else if (chosenXAxis === "obesity") {
//         xLabel = "Obesity";
//     } else if (chosenXAxis === "age") {
//         xLabel = "Age";
//     } else if (chosenXAxis === "income") {
//         xLabel = "Income";
//     } else if (chosenXAxis === "healthcare") {
//         xLabel = "Healthcare";
//     } else {
//         xLabel = "Smokes";
//     }

//     var yLabel;

//     if (chosenYAxis === "poverty") {
//         yLabel = "Poverty";
//     } else if (chosenYAxis === "obesity") {
//         yLabel = "Obesity";
//     } else if (chosenYAxis === "age") {
//         yLabel = "Age";
//     } else if (chosenYAxis === "income") {
//         yLabel = "Income";
//     } else if (chosenYAxis === "healthcare") {
//         yLabel = "Healthcare";
//     } else {
//         yLabel = "Smokes";
//     }

//     var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(d) {
//             return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
//         });

//     circlesGroup.call(toolTip);

//     circlesGroup.on("mouseover", function(data) {
//             toolTip.show(data, this);
//         })
//         // onmouseout event
//         .on("mouseout", function(data, index) {
//             toolTip.hide(data);
//         });

//     return circlesGroup;
// }



// // Retrieve data from the CSV file and execute everything below
// d3.csv("assets/data/data.csv").then(function(stateData, err) {
//     if (err) throw err;

//     // parse data
//     stateData.forEach(function(data) {
//         data.poverty = +data.poverty;
//         data.healthcare = +data.healthcare;
//         data.obesity = +data.obesity;
//         data.age = +data.age;
//         data.income = +data.income;
//         data.smokes = +data.smokes;
//     });

//     // xLinearScale function above csv import
//     var xLinearScale = xScale(stateData, chosenXAxis);

//     // Create y scale function
//     var yLinearScale = yScale(stateData, chosenYAxis);

//     // Create initial axis functions
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);

//     // append x axis
//     var xAxis = chartGroup.append("g")
//         .classed("x-axis", true)
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);

//     //append y-axis
//     var yAxis = chartGroup.append("g")
//         .classed("y-axis", true)
//         .call(leftAxis);


//     //append initial labels
//     var circleLabels = chartGroup.selectAll(null)
//         .data(stateData)
//         .enter()
//         .append("text")
//         .attr("x", d => xLinearScale(d[chosenXAxis]))
//         .attr("y", d => yLinearScale(d[chosenYAxis]))
//         .text(d => d.abbr)
//         .attr("font-size", "9px")
//         .attr("text-anchor", "middle")
//         .attr("fill", "red");

//     // append initial circles
//     var circlesGroup = chartGroup.selectAll("circle")
//         .data(stateData)
//         .enter()
//         .append("circle")
//         .attr("cx", d => xLinearScale(d[chosenXAxis]))
//         .attr("cy", d => yLinearScale(d[chosenYAxis]))
//         .attr("r", 20)
//         .attr("fill", "pink")
//         .attr("opacity", ".5");

//     // Create group for x-axis labels
//     var labelsXGroup = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     var povertyXLabel = labelsXGroup.append("text")
//         .attr("x", -350)
//         .attr("y", 20)
//         .attr("value", "poverty") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Poverty");

//     var obesityXLabel = labelsXGroup.append("text")
//         .attr("x", -200)
//         .attr("y", 20)
//         .attr("value", "obesity") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Obesity");

//     var healthcareXLabel = labelsXGroup.append("text")
//         .attr("x", -50)
//         .attr("y", 20)
//         .attr("value", "healthcare") // value to grab for event listener
//         .classed("active", true)
//         .text("Healthcare");

//     var ageXLabel = labelsXGroup.append("text")
//         .attr("x", 75)
//         .attr("y", 20)
//         .attr("value", "age") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Age");

//     var smokesXLabel = labelsXGroup.append("text")
//         .attr("x", 175)
//         .attr("y", 20)
//         .attr("value", "smokes") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Smokes");

//     var incomeXLabel = labelsXGroup.append("text")
//         .attr("x", 300)
//         .attr("y", 20)
//         .attr("value", "income") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Income");

//     // Create group for y-axis labels
//     var labelsYGroup = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     var povertyYLabel = labelsYGroup.append("text")
//         .attr("y", -50)
//         .attr("x", -475)
//         .attr("dy", "1em")
//         .attr("value", "poverty") // value to grab for event listener
//         .classed("active", true)
//         .text("Poverty");

//     var obesityYLabel = labelsYGroup.append("text")
//         .attr("y", -400)
//         .attr("x", -475)
//         .attr("dy", "1em")
//         .attr("value", "obesity") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Obesity");

//     var healthcareYLabel = labelsYGroup.append("text")
//         .attr("y", -175)
//         .attr("x", -475)
//         .attr("dy", "1em")
//         .attr("value", "healthcare") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Healthcare");

//     var ageYLabel = labelsYGroup.append("text")
//         .attr("y", -250)
//         .attr("x", -475)
//         .attr("dy", "1em")
//         .attr("value", "age") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Age");

//     var smokesYLabel = labelsYGroup.append("text")
//         .attr("y", -325)
//         .attr("x", -475)
//         .attr("dy", "1em")
//         .attr("value", "smokes") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Smokes");

//     var incomeYLabel = labelsYGroup.append("text")
//         .attr("y", -125)
//         .attr("x", -475)
//         .attr("dy", "1em")
//         .attr("value", "income") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Income");


//     // updateToolTip function above csv import
//     var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//     // x axis labels event listener
//     labelsXGroup.selectAll("text")
//         .on("click", function() {
//             // get value of selection
//             var value = d3.select(this).attr("value");
//             if (value !== chosenXAxis) {

//                 // replaces chosenXAxis with value
//                 chosenXAxis = value;

//                 // functions here found above csv import
//                 // updates x scale for new data
//                 xLinearScale = xScale(stateData, chosenXAxis);

//                 // updates x axis with transition
//                 xAxis = renderXAxis(xLinearScale, xAxis);

//                 // updates circles with new x values
//                 circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//                 //updates labels with new x values
//                 circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//                 // updates tooltips with new info
//                 circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//                 // changes classes to change bold text
//                 if (chosenXAxis === "obesity") {
//                     obesityXLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     povertyXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenXAxis === "poverty") {
//                     obesityXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyXLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     ageXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenXAxis === "age") {
//                     obesityXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageXLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     healthcareXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenXAxis === "healthcare") {
//                     obesityXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareXLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     smokesXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenXAxis === "smokes") {
//                     obesityXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesXLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     incomeXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else {
//                     obesityXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesXLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeXLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                 }
//             }
//         });

//     // y axis labels event listener
//     labelsYGroup.selectAll("text")
//         .on("click", function() {
//             // get value of selection
//             var value = d3.select(this).attr("value");
//             if (value !== chosenYAxis) {

//                 // replaces chosenYAxis with value
//                 chosenYAxis = value;

//                 // functions here found above csv import
//                 // updates y scale for new data
//                 yLinearScale = yScale(stateData, chosenYAxis);

//                 // updates y axis with transition
//                 yAxis = renderYAxis(yLinearScale, yAxis);

//                 //updates x-axis with transition
//                 xAxis = renderXAxis(xLinearScale, xAxis);

//                 // updates circles with new y values
//                 circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//                 // updates labels with new y values
//                 circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//                 // updates tooltips with new info
//                 circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//                 // changes classes to change bold text
//                 if (chosenYAxis === "obesity") {
//                     obesityYLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     povertyYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenYAxis === "poverty") {
//                     obesityYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyYLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     ageYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenYAxis === "age") {
//                     obesityYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageYLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     healthcareYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenYAxis === "healthcare") {
//                     obesityYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareYLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     smokesYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else if (chosenYAxis === "smokes") {
//                     obesityYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesYLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     incomeYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 } else {
//                     obesityYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     povertyYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     healthcareYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesYLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeYLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                 }
//             }
//         });
// }).catch(function(error) {
//     console.log(error);
// });
