<template>
  <Navbar />
  <div class="catName">
    <div class="container">
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button class="btn btn-success">Back To Category</button>
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
      <br />
    </div>
  </div>
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Category</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Add Category Name"
            v-model.trim="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <br />
        <div class="row g-3 align-items-center">
          <div
            class="col-auto d-block mx-auto alert alert-success"
            v-if="success.length > 0"
          >
            {{ success }}
          </div>
          <div
            class="col-auto d-block mx-auto alert alert-danger"
            v-if="FoundErr.length > 0"
          >
            {{ FoundErr }}
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button type="button" @click="addCategory()" class="btn btn-success">
            Add Now
          </button>
        </div>
      </div>
    </form>
  </div>
  <footerLine />
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import footerLine from "@/components/Header/footer.vue";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "AddNewCategory",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      FoundErr: "",
      success: "",
      userName: "",
      userId: "",
      locName: "",
      locAddress: "",
      locationId: this.$route.params.locationID,
      listOfUserCategories: [],
    };
  },

  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
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
    }
    this.getLocationInfo(this.userId, this.locationId);
    this.displayUserCategories(this.userId, this.locationId);
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]), // استدعيت ال functions
    ...mapActions(["redirectTo"]),
    async displayUserCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
      }
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
    async addCategory() {
      this.v$.$validate();
      let filterCategoryName = this.listOfUserCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );

      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.success = "";
          this.FoundErr = "Category Name already Exists! , Try another Name";
        } else {
          let result = await axios.post("http://localhost:3000/categories", {
            name: this.name,
            userId: this.userId,
            locationId: parseInt(this.locationId, 10),
          });
          if (result.status == 201) {
            this.FoundErr = "";
            this.success = "Added New Category!";
            // redirect To Home Page
            // use this becuase redirect is method inside another method
            setTimeout(() => {
              this.$router.push({
                name: "ViewCategories",
                params: { locationID: this.locationId },
              });
            }, 2000);
          } else {
            this.success = "";
            this.FoundErr = "something went wrong , try again!";
          }
        }
      } else {
        this.success = "";
        this.FoundErr = "You must fill in all required fields!";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mb0 {
  margin-bottom: 0;
}
.error-feedback {
  color: red;
  font-size: 0.8em;
}
.success-feedback {
  color: green;
  font-size: 0.8em;
}
.catName {
  background-color: #d4e2d4;
  margin-top: -50px;
  margin-bottom: 10px;
  padding-top: 50px;
  padding-bottom: 20px;
}
</style>
