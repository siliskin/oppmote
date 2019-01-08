<template>
  <section>
    <div class="column">
      <h1 class="title">
        Fredagsgym
      </h1>
      <div v-if="!this.loading">
        <h2 class="subtitle">
          {{ nextEvent.location }} <strong style="color: inherit">{{nextEvent.date}}</strong>
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
  </section>
</template>

<script>
import { db } from '../main';
import Stats from './Stats';

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
        console.log(this.nextEventRef);
        this.loading = false;
      } else {
        console.log("No such document, creating new event for:", nextFridayStr);
        db.collection("events").doc(nextFridayStr).set({
          name: "Fredagsgym",
          date: nextFridayStr,
          created_at: new Date(),
          location: "Birkenlundhallen",
          participants: []
        })
        .then( () => {
          console.log("Document successfully written!");
        });
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

section {
  text-align: center;
}
</style>
