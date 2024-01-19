<template>
  <div class="d-flex align-items-center justify-content-center vh-100">
    <div class="text-center">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="fs-3"><span class="text-danger">Opps!</span> Page not found.</p>
      <p class="lead">Sorry</p>
      <RouterLink
        class="link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover"
        to="/"
      >
        Back to Homepage
      </RouterLink>
    </div>
  </div>
</template>

<script setup></script>

<route lang="json">
{
  "name": "404",
  "meta": {
    "title": "Error - oops",
    "layout": "404"
  }
}
</route>
