<template>
      <Navbar />
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Delete All Locations</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete All locations ?
          </p>
          <p class="text-danger">
            It will also delete all related items and categeries... Be careful!!
          </p>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllRestaurant()">
            Delete All Now
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          v-if="success.length > 0"
          class="col-auto d-block mx-auto alert alert-success"
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
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteAllLocations",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      userId: "",
      allLocationsId: [],
      FoundErr: "",
      success: "",
      allCatsId: [],
      allItemsId: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`
      );
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allLocationsId.push(result.data[i].id);
      }
      ///// delete categories
      let resultCatLoc = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}`
      );
      let resultCatLocLen = resultCatLoc.data.length;
      for (var i = 0; i < resultCatLocLen; i++) {
        this.allCatsId.push(resultCatLoc.data[i].id); // <-- Corrected
      }
      ///// delete items
      let resultItemsLoc = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}`
      );
      let resultItemLocLen = resultItemsLoc.data.length;
      for (var i = 0; i < resultItemLocLen; i++) {
        this.allItemsId.push(resultItemsLoc.data[i].id); // <-- Corrected
      }
      console.table(this.allLocationsId);
      console.table(this.allCatsId);
      console.table(this.allItemsId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ to: "Home" });
    },
    async deleteAllRestaurant() {
      let allItemsResults = [];
      for (var m = 0; m < this.allItemsId.length; m++) {
        let result1 = await axios.delete(
          `http://localhost:3000/items/${this.allItemsId[m]}`
        );
        if (result1.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      ////////
      //////////////////
      let allCatResults = [];
      for (var c = 0; c < this.allCatsId.length; c++) {
        let result2 = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsId[c]}`
        );
        if (result2.status == 200) {
          allCatResults.push(true);
        } else {
          allCatResults.push(false);
        }
      }
      //
      let allResults = [];
      for (var i = 0; i < this.allLocationsId.length; i++) {
        let result3 = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationsId[i]}`
        );
        if (result3.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }

      //////

      if (
        !allResults.includes(false) &&
        !allItemsResults.includes(false) &&
        !allCatResults.includes(false)
      ) {
        this.FoundErr = "";
        this.success = "All Location are Deleted...";
        setTimeout(() => {
          this.redirectTo({ to: "Home" });
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
