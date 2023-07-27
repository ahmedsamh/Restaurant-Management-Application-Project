<template>
  <Navbar />
  <div class="catName">
    <div class="container">
      <router-link
        :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
      >
        <button class="btn btn-primary">Add Categories</button>
      </router-link>
      &nbsp;&nbsp;&nbsp;
      <router-link :to="{ name: 'Menu', params: { locationID: locationId } }">
        <button class="btn btn-success">Back To Menu</button>
      </router-link>
      <br />
      <div class="text-center">
        <h1 class="mb0">{{ locName }}</h1>
        <p class="text-muted">{{ locAddress }}</p>
      </div>
    </div>
  </div>
  <div class="container">
    <table class="table caption-top" v-if="numOfCategories > 0">
      <caption>
        <span> List Of categories ({{ numOfCategories }}) </span>
        <span class="float-end">
          <!-- <router-link :to="{name : 'DeleteAllLocations'}">
          <button class="btn btn-danger">Delete All</button>
        </router-link> -->
          <router-link
            :to="{
              name: 'DeleteAllCategories',
              params: { locationId: locationId },
            }"
          >
            <button class="btn btn-danger">Delete All</button>
          </router-link>
        </span>
      </caption>
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listOfCategories" :key="i">
          <th scope="row">{{ cat.name }}</th>
          <!-- <td>{{ loc.phone }}</td>
        <td>{{ loc.address }}</td> -->
          <td>
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-info">Update</button> </router-link
            >&nbsp;
            <router-link
              :to="{
                name: 'DeleteCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="alert alert-warning mt15" role="alert" v-else>
      No categories Added Yet
    </div>
  </div>
  <footerLine />
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import footerLine from "@/components/Header/footer.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "ViewCategories",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      userName: "",
      userId: "",
      locName: "",
      locAddress: "",
      locationId: this.$route.params.locationID,
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "LoggedInUserId",
      "numOfCategories",
      "listOfCategories",
    ]), // لازم نفعل ال function
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.canUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "Home",
      });
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
    }
    this.getLocationInfo(this.userId, this.locationId);
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]), // استدعيت ال functions
    ...mapActions(["redirectTo"]),
    async getLocationInfo(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&id=${locId}`
      );
      let locDetails = [];
      if (result.status == 200) {
        locDetails = result.data;
        this.locName = locDetails[0].name;
        this.locAddress = locDetails[0].address;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mb0 {
  margin-bottom: 0;
}
.catName {
  background-color: #d4e2d4;
  margin-top: -50px;
  margin-bottom: 10px;
  padding-top: 50px;
  padding-bottom: 20px;
}
</style>
