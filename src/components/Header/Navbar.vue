<template>
  <ul id="nav">
    <div class="container d-flex justify-content-between align-items-center">
    <router-link
  :to="{ name: 'Home', params: { pageTitle: 'Home Page' } }"
  exact
  v-slot="{ href, navigate, isActive }"
>
  <li :class="{ active: isActive }">
    <a :href="href" @click="navigate">Home</a>
  </li>
</router-link>
<a class="text-end d-flex justify-content-between align-items-center" >
      Welcome &nbsp;
      <router-link :to="{ name: 'profile' }">
        <button
          class="btn btn-info"
          type="button"
          data-toggle="tooltip"
          data-placement="top"
          title="Profile"
        >
          {{ userName }}
        </button>
      </router-link>&nbsp;
      <router-link :to="{ name: 'profile' }">
      <div class="image">
            <img :src="photoUrl" alt="" />
          </div>
        </router-link>
    </a>
    <a href="#" @click="logMeOut()">
      <button
          class="btn btn-danger">Logout</button> </a>
  </div>
  </ul>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "navbarN",
  data() {
    return {
      userName: "",
      userId: "",
      photoUrl: null,
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.photoUrl = JSON.parse(user).photoUrl;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    logMeOut() {
      localStorage.clear();
      // this.$router.push({name : "LogIn"});
      this.redirectTo({ to: "LogIn" });
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
$fontColor: white;
$navColor:#91C8E4;
ul {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-bottom: 50px;
  background-color: black;
  a {
    text-decoration: none;
    font-weight: bold;
    color: $fontColor;
    padding: 3px;
  }
}
a.router-link-exact-active a,
ul a a:hover {
  color: $navColor;
  box-shadow: 2px 2px 4px 0px $navColor;
}
.image {
  width: 50px;
  height: 50px;
}
.image img {
  border-radius: 50%;
  border: 1px solid black;
  width: 100%;
}
</style>
