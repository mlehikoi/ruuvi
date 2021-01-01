let state = {
    graph: {
        humidity: {},
        temperature: {},
        pressure: {}
    }
};

google.charts.load('current', { 'packages': ['gauge'] });
google.charts.setOnLoadCallback(drawGraphs);

function isMobile()
{
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function drawAll(readings)
{
    drawChart('humidity', 'chart1', 'overlay', readings, 'Humidity %');
    drawGauge(readings);
    
    drawChart('temperature', 'tempChart', 'tempOverlay', readings, 'Temperature °C');
    drawTempGauge(readings);

    drawChart('pressure', 'pressureChart', 'pressureOverlay', readings, 'Pressure hPa');
    drawPressureGauge(readings);
}

async function fetchData(then1, begin, end) {
    let url = '/api/v1/ruuvi?name=humidori';
    if (begin != end) {
        url += '&begin=' + encodeURIComponent(begin) + '&end=' + encodeURIComponent(end);
    }
    const response = await fetch(url); 
    const json = await response.json();
    console.log(json.length);
    then1(json);
}
function drawChart(param, chartName, overlayName, readings, label) {
    let graph = state.graph[param];
    graph.data = [];
    for (r of readings) {
        graph.data.push({
            t: r.updatedAt,
            y: r[param]
        });
    }
    if (graph.chart) {
        console.log('update');
        graph.chart.config.data.datasets[0].data = graph.data;
        graph.chart.update();
    }
    else {
        let cfg = {
            data: {
                datasets: [{
                    label: 'Humidor',
                    backgroundColor: "rgba(104, 255, 147, 0.2)",
                    borderColor: "rgba(104, 255, 127, 1.0)",
                    data: [],
                    type: 'line',
                    pointRadius: 0,
                    fill: true,
                    lineTension: 0,
                    borderWidth: 2,
                    data: graph.data
                }]
            },
            options: {
                legend: {
                    display: false
                },
                animation: {
                    duration: 0
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            stepSize: 1,
                            displayFormats: {
                                day: 'D.M.YYYY',
                                hour: 'HH:mm'
                            }
                        },
                        distribution: 'linear',
                        offset: false,
                        ticks: {
                            major: {
                                enabled: true,
                                fontStyle: 'bold'
                            },
                            autoSkip: true,
                            // autoSkipPadding: 350,
                            maxRotation: 0,
                        },
                    }],
                    yAxes: [{
                        gridLines: {
                            drawBorder: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: label
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label: function (tooltipItem, myData) {
                            var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += parseFloat(tooltipItem.value).toFixed(2);
                            return label;
                        }
                    }
                }
            }
        };
        var canvas = document.getElementById(chartName);
        var ctx = canvas.getContext('2d');
        graph.chart = new Chart(ctx, cfg);

        var overlay = document.getElementById(overlayName);
        if (isMobile()) {
            overlay.parentNode.removeChild(overlay);
        }
        else
        {
            var startIndex = 0;
            overlay.width = canvas.width;
            overlay.height = canvas.height;
            var selectionContext = overlay.getContext('2d');
            var selectionRect = {
                w: 0,
                startX: 0,
                startY: 0
            };
            var drag = false;
            canvas.addEventListener('pointerdown', evt => {
                const points = graph.chart.getElementsAtEventForMode(evt, 'index', {
                    intersect: false
                });
                startIndex = points[0]._index;
                const rect = canvas.getBoundingClientRect();
                selectionRect.startX = evt.clientX - rect.left;
                selectionRect.startY = graph.chart.chartArea.top;
                drag = true;
                // save points[0]._index for filtering
            });
            canvas.addEventListener('pointermove', evt => {

                const rect = canvas.getBoundingClientRect();
                if (drag) {
                    const rect = canvas.getBoundingClientRect();
                    selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
                    selectionContext.globalAlpha = 0.5;
                    selectionContext.clearRect(0, 0, canvas.width, canvas.height);
                    selectionContext.fillRect(selectionRect.startX,
                        selectionRect.startY,
                        selectionRect.w,
                        graph.chart.chartArea.bottom - graph.chart.chartArea.top);
                } else {
                    selectionContext.clearRect(0, 0, canvas.width, canvas.height);
                    var x = evt.clientX - rect.left;
                    if (x > graph.chart.chartArea.left) {
                        selectionContext.fillRect(x,
                            graph.chart.chartArea.top,
                            1,
                            graph.chart.chartArea.bottom - graph.chart.chartArea.top);
                    }
                }
            });
            canvas.addEventListener('pointerup', evt => {

                const points = graph.chart.getElementsAtEventForMode(evt, 'index', {
                    intersect: false
                });
                drag = false;
                fetchData(drawAll, graph.data[startIndex].t, graph.data[points[0]._index].t);
            });
        }
    }
}

function drawGauge(readings, label, param) {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Humidity', readings[0].humidity],
    ]);

    var options = {
        //width: 360, height: 360,
        redFrom: 72, redTo: 100,
        yellowFrom: 0, yellowTo: 65,
        greenFrom: 65, greenTo: 72,
        majorTicks: ['0', '', '', '', '', '', '', '', '', '', '100'],
        minorTicks: 10
    };

    var chart = new google.visualization.Gauge(document.getElementById('gauge'));
    chart.draw(data, options);
}

function drawTempGauge(readings) {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Temp', readings[0]['temperature']],
    ]);

    var options = {
        min: -10, max: 50,
        redFrom: 22, redTo: 30,
        yellowFrom: 0, yellowTo: 18,
        greenFrom: 18, greenTo: 22,
        majorTicks: ['-10', '0', '10', '20', '30', '40', '50'],
        minorTicks: 10
    };

    var chart = new google.visualization.Gauge(document.getElementById('tempGauge'));
    chart.draw(data, options);
}

function drawPressureGauge(readings) {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['', readings[0]['pressure']],
    ]);

    var options = {
        min: 970, max: 1040,
        redFrom: 22, redTo: 30,
        yellowFrom: 0, yellowTo: 18,
        greenFrom: 18, greenTo: 22,
        majorTicks: ['970', '980', '990', '1000', '', '1020', '1030', '1040'],
        minorTicks: 10
    };

    var chart = new google.visualization.Gauge(document.getElementById('pressureGauge'));
    chart.draw(data, options);
}

function drawGraphs() {
    fetchData(drawAll);
    //fetchData(drawChart, drawGauge);
    // fetchData(function(readings) {
    //     drawChart(data1, cfg1, chart1, 'chart1', 'overlay', readings, 'Humidity %', 'humidity');
    //     drawGauge(readings);
        
    //     drawChart(data2, cfg2, chart2, 'tempChart', 'tempOverlay', readings, 'Temperature °C', 'temperature');
    //     drawTempGauge(readings);

    //     drawChart(data3, cfg3, chart3, 'pressureChart', 'pressureOverlay', readings, 'Pressure hPa', 'pressure');
    //     drawPressureGauge(readings);
    //     //console.log(readings.length);
    // });
}
