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
      loading: true
    }
  },
  created: function() {
    //var self = this;
    const fridayOfWeek = 5;
    var d = new Date();
    d.setHours(0,0,0,0);
    var diff = fridayOfWeek - new Date().getDay();
    var nextFriday = new Date(d.setDate(d.getDate() + diff));
    var nextFridayStr = (nextFriday.getDate() + "-" + (nextFriday.getMonth()+1) + "-" + nextFriday.getFullYear());

    var docRef = db.collection("events").doc(nextFridayStr);

    docRef.get().then( doc =>  {
      if (doc.exists) {
        console.log("Document data:", doc.data());
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
          //re-read data
          docRef.get().then( doc => {
            this.nextEvent = doc.data();
            this.nextEventRef = doc.id;
            this.loading = false;            
          });
        });
      }
    }).catch( error => {
      console.log("Error getting document:", error);
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
    },
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
