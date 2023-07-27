<template>
    <div>
        <div class="text-center">
        <router-link :to="{name:'Home'}">
            <button class="btn btn-info">Visit Home Page</button>
        </router-link>
    </div>
    <br>
    <img src="../assets/R.png" alt="" class="rounded mx-auto d-block h400">
    </div>

</template>

<script>
export default {
  name: "ErrorPage",
}
</script>

<style lang="scss" scoped>
.h400{
height: 400px;
}
button{
    margin-top: 50px;
}
</style>