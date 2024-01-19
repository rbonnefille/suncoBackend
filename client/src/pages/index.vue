<template>
  <div class="px-4 py-5 my-5 text-center">
    <img src="../assets/zd.svg" alt="Zendesk Logo" />
    <div class="col-lg mx-auto mt-4">
      <h4 class="lead mb-4">
        🚧 This is a dashboard for SunCo/Messaging. It is a work in progress.
      </h4>
      <div class="d-grid gap-2 flex justify-content-sm-center">
        <RouterLink v-for="(route, index) in routes" :key="route.to" :to="route.to" :target="route.target"
          class="btn btn-lg" v-bind="$attrs">
          {{ route.text }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const routes = [
  {
    to: "/dashboard",
    text: "Go to the Dashboard",
  },
  {
    to: "/sunco/integrations",
    text: "Check SunCo integrations",
  },
  {
    to: "/sunco/integrations/switchboard",
    text: "Switchboard Configuration",
  },
  {
    to: "/sunco/snippets/web-widget",
    text: "Web Widget Snippets",
  },
  {
    to: "/sunco/users",
    text: "Check SunCo User",
  }
];
</script>

<route lang="json">
{
  "name": "Home",
  "meta": {
    "layout": "home",
    "title": "Home"
  }
}
</route>

<style lang="css" scoped>
a {
  background: #d6eef1;
  border: none;
  color: #03363d;
  text-align: center;
  text-decoration: none;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}

a:focus,
a:hover {
  background-color: #03363d;
  color: white;
}
</style>
