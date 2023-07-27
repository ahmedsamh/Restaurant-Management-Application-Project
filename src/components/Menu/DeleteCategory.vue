<template>
      <Navbar />
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Delete Category #{{ catId }}</h1>
          <h4>Category Name #{{ name }}</h4>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this category ?
          </p>
          <p class="text-danger">
            when deleting this category , it will delete all related menu items
            as well..
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteCategory()">
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
import { mapActions, mapMutations } from "vuex";
export default {
  name: "DeleteCategory",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      locationId: this.$route.params.locationID,
      catId: this.$route.params.catId,
      userId: "",
      locationData: [],
      allItemsId: [],
      FoundErr: "",
      name: "",
      success: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.deleteLocation = this.$route.params.locationID;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canUserAccessThisCategory({
        userIdIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "Home",
      });
      this.getCategoryName(this.userId, this.locationId, this.catId);

      //// get all items id
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      let resultLen = result.data.length;
      console.log(resultLen);
      for (var i = 0; i < resultLen; i++) {
        this.allItemsId.push(result.data[i].id);
      }
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisCategory"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
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
    async getCategoryName(userId, locId, catId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`
      );
      if (result.status == 200) {
        this.categoryNames = result.data;
        if (this.categoryNames.length > 0) {
          this.name = this.categoryNames[0].name;
        }
      }
    },
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.catId}`
      );
      /// delete all items
      let allResults = [];
      for (var i = 0; i < this.allItemsId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsId[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      ///
      if (result.status == 200 && !allResults.includes(false)) {
        this.FoundErr = "";
        this.success = "Category and related items are Deleted...";
        setTimeout(() => {
          this.$router.push({
            name: "ViewCategories",
            params: { locationId: this.locationId },
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
