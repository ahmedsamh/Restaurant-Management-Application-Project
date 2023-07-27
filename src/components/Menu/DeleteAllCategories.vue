<template>
      <Navbar />
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Delete All Categories #{{ catId }}</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete All Categories for this Location?
          </p>
          <br />
          <div class="text-center">
            <h1 class="mb0">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
          </div>
          <p class="text-danger">
            when deleting all categories , their related menu items will be
            deleted as well..
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllCategories()">
            Delete Now
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="success.length > 0"
        >
          {{ success }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="FoundErr.length > 0"
        >
          {{ FoundErr }}
        </div>
      </div>
    </form>
  </div>
  <footerLine />
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import footerLine from "@/components/Header/footer.vue";
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "DeleteCategory",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locationData: [],
      allItemsId: [],
      FoundErr: "",
      success: "",
      locName: "",
      name: "",
      locAddress: "",
      allCatsId: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.deleteLocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.getLocationInfo(this.userId, this.locationId);

      //// get all items id
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.locationId}`
      );
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsId.push(result.data[i].id);
      }
      let resultForCategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.locationId}`
      );
      let resultCatLen = resultForCategories.data.length;
      for (var c = 0; c < resultCatLen; c++) {
        this.allCatsId.push(resultForCategories.data[c].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationID: this.locationId },
      });
    },
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
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}&id=${this.deleteLocation}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.phone = this.locationData[0].phone;
        this.address = this.locationData[0].address;
      } else {
        this.redirectTo({ to: "Home" });
      }
    },
    async deleteAllCategories() {
      let allCatsResults = [];
      for (var v = 0; v < this.allCatsId.length; v++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsId[v]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      /// delete all items
      let allItemsResults = [];
      for (var y = 0; y < this.allItemsId.length; y++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsId[y]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      ///
      console.log(allItemsResults)
      if (!allCatsResults.includes(false) && !allItemsResults.includes(false)) {
        this.FoundErr = "";
        this.success = "Category and related items are All Deleted...";
        setTimeout(() => {
          this.$router.push({
            name: "Home",
          });
        }, 2000);
      } else {
        this.success = "";
        this.FoundErr = "something went wrong , try again!";
      }
    },
  },
};
</script>

<style scoped></style>
