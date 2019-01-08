<template>
  <section>
    <div class="container">
      <h3>Oppmøte</h3>
      <div class="content">
        <canvas id="stat-chart" height="100"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Oppmote',
  data () {
    return {
      perps: [],
      chart: 0
    }
  },

  mounted: function() {
    console.log("Component Oppmote mounted");
    var ctx = document.getElementById( "stat-chart" );
    var dates = [];
    var perps = [];
    db.collection("events").orderBy('created_at').onSnapshot( querySnapShot => {
      querySnapShot.docChanges().forEach(change => {
        if (change.type === "added") {
          dates.push(change.doc.data().date);
          perps.push(change.doc.data().participants.length);
        }
        if (change.type === "modified") {
          console.log("What changed?", dates.indexOf(change.doc.data().date));
          perps[dates.indexOf(change.doc.data().date)] = change.doc.data().participants.length;
          this.chart.update();
        }
      }); 

      var chartData = {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
          { 
            data: perps,
            fill: false,
            borderColor: '#fff',
            borderWidth: 3
          },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          lineTension: 1,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
             label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25,
            }
          }]
        }
      }
    };
    if(this.chart == 0) {
      console.log("Creating chart with dates: ", dates);
      console.log("and perps: ", perps);
      this.chart = new Chart(ctx, chartData);
    }
  });
}
}
</script>

<style scoped>

section {
  padding: 0 !important;
  text-align: center;
  background-color: rgba(177,185,228,0.3);

}

  </style>
