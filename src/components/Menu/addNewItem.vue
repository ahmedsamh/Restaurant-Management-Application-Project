<template>
  <Navbar />
  <div class="catName">
  <div class="container">
    <router-link :to="{ name: 'Menu', params: { locationID: locationId } }">
      <button type="button" class="float-start btn btn-success">Back TO Menu</button>
    </router-link>
    <br />
    <div class="text-center">
      <h1 class="mb0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
  </div>
  </div>
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Item</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemName.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
              v-model.trim="itemName"
            />
            <label for="floatItemName">Enter Item Name</label>
            <span class="error-feedback" v-if="v$.itemName.$error">{{
              v$.itemName.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemPrice.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemPrice"
              placeholder="Enter Item Price"
              v-model.trim="itemPrice"
            />
            <label for="floatItemPrice">Enter Item Price</label>
            <span class="error-feedback" v-if="v$.itemPrice.$error">{{
              v$.itemPrice.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemsQty.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantities"
              v-model.trim="itemsQty"
            />
            <label for="floatItemQty">Enter Item Quantities</label>
            <span class="error-feedback" v-if="v$.itemsQty.$error">{{
              v$.itemsQty.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.description.$error }"
          >
            <textarea
              class="w250 h200 form-control"
              id="floatItemDescriptions"
              placeholder="Enter Item Descriptions"
              v-model.trim="description"
            />
            <label for="floatItemDescriptions">Enter Item Descriptions</label>
            <span class="error-feedback" v-if="v$.description.$error">{{
              v$.description.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.pickedCategory.$error }"
          >
            <select
              class="form-select w250"
              id="floatItemCategory"
              v-model.trim="pickedCategory"
            >
              <option
                v-for="(cat, i) in listOfCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
            <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
              v$.pickedCategory.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="addNewItem()"
            class="btn btn-primary w250"
          >
            Add Now
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
          class="col-auto d-block mx-auto alert alert-danger"
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
import { mapActions, mapState, mapMutations } from "vuex";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";
import axios from "axios";
export default {
  name: "addNewItem",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      v$: useValidate(),
      FoundErr: "",
      success: "",
      pickedCategory: "",
      userName: "",
      userId: "",
      locName: "",
      locAddress: "",
      locationId: this.$route.params.locationId,
      itemName: "",
      description: "",
      itemsQty: "",
      itemPrice: "",
    };
  },
  validations() {
    return {
      itemName: { required, minLength: minLength(5) },
      description: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(200),
      },
      itemsQty: { required, between: between(1, 100000) },
      itemPrice: { required, between: between(0, 1000000) },
      pickedCategory: { required },
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
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedInUser(); // شغلت ال function
      // this.locationId = this.$route.params.locationID;
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.canUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "Home",
      });
      this.getLocationInfo(this.userId, this.locationId);
    }
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
    async addNewItem() {
      this.v$.$validate(); // activate validations
      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/items`, {
          name: this.itemName,
          price: parseFloat(this.itemPrice).toFixed(2),
          description: this.description,
          qty: parseInt(this.itemsQty),
          userId: this.userId,
          locId: parseInt(this.locationId),
          catId: this.pickedCategory,
        });
        if (result.status == 201) {
          this.FoundErr = "";
          this.success = "Added New Item!";
          // redirect To Home Page
          // use this becuase redirect is method inside another method
          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { locationID: this.locationId },
            });
          }, 2000);
        } else {
          this.success = "";
          this.FoundErr = "something went wrong , try again!";
        }
      } else {
        this.success = "";
        this.FoundErr = "You must fill in all required fields!";
      }
    },
    // getBackToMenu() {
    //   this.$router.push({
    //     name: "Menu",
    //     params: { locationID: this.locationId },
    //   });
    // },
  },
};
</script>

<style scoped>
.error-feedback {
  color: red;
  font-size: 0.8em;
}
.success-feedback {
  color: green;
  font-size: 0.8em;
}
.mb0 {
  margin-bottom: 0;
}
.w250 {
  min-width: 250px;
}
.h200 {
  min-height: 200px !important;
}
.form-group-error {
  color: red;
}
.form-group-error input,
.form-group-error select,
.form-group-error textarea {
  border-color: red;
}
.catName {
  background-color: #d4e2d4;
  margin-top: -50px;
  margin-bottom: 10px;
  padding-top: 50px;
  padding-bottom: 20px;
}
</style>
