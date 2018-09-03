<template>
  <div class="hello">
    <div v-for="{name} in pages" :key="name">
      <router-link :to="{name:  'desc_' + name}">{{name}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pages () {
      return this.$router.options.routes[1].children
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
