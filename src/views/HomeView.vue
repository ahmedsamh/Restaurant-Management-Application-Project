<template>
  <Navbar />
  <div class="catName">
    <div class="container">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div class="text-center">
            <h1 class="mb0">My Locations</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <router-link :to="{ name: 'AddNewLocation' }">
      <button type="button" class="btn btn-primary">
        Add New Restaurant
      </button></router-link
    >
    <UserLocations :allLocations="listOfLocations" />
  </div>
  <footerLine />
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import footerLine from "@/components/Header/footer.vue";
import UserLocations from "@/components/Locations/UserLocations.vue";
import { mapActions } from "vuex";
import axios from "axios";
// @ is an alias to /src

export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      listOfLocations: [],
    };
  },
  components: {
    Navbar,
    footerLine,
    UserLocations,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      console.log(result.data);
      this.listOfLocations = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>

<style scoped>
.catName {
  background-color: #d4e2d4;
  margin-top: -50px;
  margin-bottom: 10px;
  padding-top: 50px;
  padding-bottom: 20px;
}
</style>