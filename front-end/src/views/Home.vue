<template>
<div class="home">
    <p v-if="!user">Welcome, please login or register using the profile page available on the menu!</p>
    <div id="slider">
      <figure>
        <img src="/newlights.jpg">
        <img src="/blue-lights.jpg">
        <img src="/Christmas-tree.jpg">
        <img src="/lotsoflights.jpg">
        <img src="/newlights.jpg">
      </figure>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
}

#slider {
  overflow: hidden;
}

#slider figure {
  position: relative;
  width: 500%;
  margin: 0;
  left: 0;
  animation: 20s slider infinite;
}

#slider figure img {
  float: left;
  width: 20%;
}

@keyframes slider {
  0% {
    left: 0;
  }
  20% {
    left: 0;
  }
  25% {
    left: -100%;
  }
  45% {
    left: -100%;
  }
  50% {
    left: -200%;
  }
  70% {
    left: -200%;
  }
  75% {
    left: -300%;
  }
  90% {
    left: -300%
  }
  100% {
    left: -400%;
  }
}

p {
  text-align: center;
  font-family: 'Raleway';
  text-transform: uppercase;
  font-size: 0.8em;
  background-color: #3c8cbc;
  color: white;
  padding: 5px;
}
</style>
