<template>
  <section class="hero is-fullheight">
    <div class="section">
      <div class="container">
        <div class="column is-6 is-offset-3">
          <div v-if="this.loading">
            <div class="spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
          <h1 class="title">
            {{ nextEvent.name }}
          </h1>
          <div v-if="!this.loading">
            <h2 class="subtitle">
              {{ nextEvent.location }} <strong>{{nextEvent.date}}</strong>
            </h2>
            <h3>
              <strong v-if="nextEvent.participants.length > 4 ">{{nextEvent.participants.length}}</strong>
              <strong style="color:red" v-if="nextEvent.participants.length < 5 ">{{nextEvent.participants.length}}</strong>
              <span> deltakere</span>
            </h3> 
          </div>
          <div v-if="!this.loading" class="content">
            <span v-for="(participant, index) in nextEvent.participants">
              {{ participant }}<span v-if="index != (nextEvent.participants.length -1)">,</span>
            </span>
            <progress v-if="nextEvent.participants.length < 4" class="progress is-medium is-danger" v-bind:value="nextEvent.participants.length" max="10"></progress>
            <progress v-if="nextEvent.participants.length >= 4 && nextEvent.participants.length < 6" class="progress is-medium is-warning" v-bind:value="nextEvent.participants.length" max="20"></progress>
            <progress v-if="nextEvent.participants.length > 5" class="progress is-medium is-success" v-bind:value="nextEvent.participants.length" max="10"></progress>
          </div>
          <div>
            <form id="signup-form" class="description" @submit.prevent="signup">
              <div class="field is-grouped">
                <div class="control is-expanded">
                  <input type="text" class="input" name="name" placeholde="Skriv inn navnet ditt" required="" autocomplete="off" v-model="name">
                </div>
                <div class="control">
                  <button class="button is-info">
                    Delta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-6 is-offset-3 " >
      <h3>Oppmøte</h3>
      <div class="content has-text-centered">
        <canvas id="stat-chart" width="100" height="100"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Events',
  data () {
    return {
      events: [],
      nextEvent: 0,
      nextEventRef: 0,
      name: '',
      loading: true,
      chart: 0
    }
  },
  created: function() {
    const fridayOfWeek = 5;
    var d = new Date();
    d.setHours(0,0,0,0);
    var diff = fridayOfWeek - new Date().getDay();
    var nextFriday = new Date(d.setDate(d.getDate() + diff));
    var nextFridayStr = (nextFriday.getDate() + "-" + (nextFriday.getMonth()+1) + "-" + nextFriday.getFullYear());

    var docRef = db.collection("events").doc(nextFridayStr);

    

    docRef.onSnapshot( doc =>  {
      if (doc.exists) {
        this.nextEvent = doc.data();
        this.nextEventRef = doc.id;
        this.loading = false;
      } else {
        console.log("No such document, creating new event for:", nextFridayStr);
        db.collection("events").doc(nextFridayStr).set({
          name: "Fredagsgym",
          date: nextFridayStr,
          location: "Birkenlundhallen",
          participants: []
        })
        .then( () => {
          console.log("Document successfully written!");
        });
      }
    });
  },

  mounted: function() {
    var ctx = document.getElementById( "stat-chart" );
    var dates = [];
    var perps = [];
    db.collection("events").orderBy('date').onSnapshot( querySnapShot => {
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
          borderColor: '#36495d',
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

},

methods: {
  addUser: function() {
      // var self = this;
      db.collection('events').doc(this.nextEventRef).update({ "participants" : this.nextEvent.participants })
    },
    signup: function() {
      this.nextEvent.participants.push(this.name);
      this.addUser();
      this.name="";
    }    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
    }  20% { 
      transform: scaleY(1.0);
      -webkit-transform: scaleY(1.0);
    }
  }

  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>
