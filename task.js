// Load data from JSON file
d3.json("mock_data.json").then(function(data) {
    // Get unique dates from data
    var dates = [...new Set(data.map(d => d.item_date))];
  
    // Create options for select element
    var select = document.getElementById("date-select");
    dates.forEach(function(date) {
      var option = document.createElement("option");
      option.text = date;
      option.value = date;
      select.add(option);
    });
  
    // Create chart
    var chart = new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Schedules',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  
    // Update chart when date is selected
    select.addEventListener("change", function() {
      var selectedDate = this.value;
      var filteredData = data.filter(function(d) {
        return d.item_date === selectedDate;
      });
      var timeBins = ["9am-12pm", "12pm-3pm", "3pm-6pm", "6pm-9pm"];
      var scheduleCounts = [0, 0, 0, 0];
      filteredData.forEach(function(d) {
        var hour = new Date(d.schedule_time).getHours();
        if (hour >= 9 && hour < 12) {
          scheduleCounts[0]++;
        } else if (hour >= 12 && hour < 15) {
          scheduleCounts[1]++;
        } else if (hour >= 15 && hour < 18) {
          scheduleCounts[2]++;
        } else if (hour >= 18 && hour < 21) {
          scheduleCounts[3]++;
        }
      });
      chart.data.labels = timeBins;
      chart.data.datasets[0].data = scheduleCounts;
      chart.options.title = {
        display: true,
        text: 'Schedules for ' + selectedDate
      };
      chart.update();
    });
  }).catch(function(error) {
    console.log(error);
  });
  