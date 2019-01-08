<template>
  <section>
    <div class="container">
      <h2 class="subtitle">
        Kongen av gymmen<BR/>
      </h2>
      <span v-for="(p, index) in this.perps">
        {{ p.name }} : {{ p.attendance }} <BR/>
      </span>
    </div>
  </section>
</template>

<script>
import { db } from '../main'

var Perp = function ( name ) {
  this.name = name;
  this.attendance = 1;
};

Perp.prototype.increaseAttendance = function () {
  this.attendance++;
}

export default {
  name: 'Stats',
  data () {
    return {
      perps: []
    }
  },

  created: function() {
    const thisYear = 2019;
  },

  mounted: function() {
    db.collection("events").orderBy('created_at').onSnapshot( querySnapShot => {
      querySnapShot.docChanges().forEach(change => {
        var index = -1;
        
        console.log("Change type =", change.type);
        if( change.type === "added") {
          change.doc.data().participants.forEach( el => {
            if( (index = this.perps.map(p => p.name).indexOf(el)) == -1 ) {
              this.perps.push(new Perp(el));
              console.log(el);
            } else {
              this.perps[index].increaseAttendance();
              this.perps.sort( (a, b) => {
                return b.attendance - a.attendance; 
              });  
            }
          })
        } 
        if( change.type === "modified") {

        }

      });
    });
  },

  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

section {
  padding: 0 !important;
  text-align: center;
}

</style>
