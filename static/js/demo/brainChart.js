// Get the context of the canvas element we want to select
var ctx = document.getElementById("myAreaChart").getContext("2d");

var genders = {{genders|safe}};
var ages = {{ages|safe}};
var weights = {{weights|safe}};
var sizes = {{sizes|safe}};

var data = {
    labels: genders,
    datasets: [
        {
            label: "Weights Dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: weights
        },
        {
            label: "Sizes dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: sizes
        }
    ]
};

var myLineChart = new Chart(ctx).Line(data);