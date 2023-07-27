<template>
  <Navbar />
  <div class="catName">
    <div class="container">
      <router-link :to="{ name: 'Menu', params: { locationID: locationId } }">
        <button type="button" class="float-start btn btn-success">
          Back TO Menu
        </button>
      </router-link>
      <div class="clearfix"></div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div class="text-center">
            <h1 class="mb0">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Delete Item #{{ itemId }}</h1>
          <hr />
          <p class="text-danger">Are you sure you want to delete this item ?</p>
          <hr />
          <h4>Item Name {{ itemName }}</h4>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteItem()">
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
  name: "DeleteItem",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      userId: "",
      locationData: [],
      allItemsId: [],
      FoundErr: "",
      name: "",
      success: "",
      locAddress: "",
      locName: "",
      itemName: "",
      //   pickedCategory :"",
      //   description: "",
      //   itemsQty: "",
      //   itemPrice: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canUserAccessThisItem({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        itemIdIs: this.itemId,
        redirectToPage: "Home",
      });
      this.getCategoryName(this.userId, this.locationId, this.catId);
      this.getItemInfo(this.userId, this.locationId, this.itemId);

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
    ...mapMutations(["canUserAccessThisItem"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "Menu",
        params: { locationID: this.locationId },
      });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.locName = this.locationData[0].name;
        this.locAddress = this.locationData[0].address;
      } else {
        this.redirectTo({ to: "Home" });
      }
    },
    async getItemInfo(userId, locId, itemId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locationId=${locId}&id=${itemId}`
      );
      let resultData = result.data[0];
      if (result.status == 200) {
        this.itemName = resultData.name;
        // this.itemPrice = resultData.price;
        // this.description = resultData.description;
        // this.itemsQty = resultData.qty;
        // this.userId = resultData.userId;
        // this.pickedCategory = resultData.catId;
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
    async deleteItem() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemId}`
      );
      /// delete all items
      //   let allResults = [];
      //   for (var i = 0; i < this.allItemsId.length; i++) {
      //     let result = await axios.delete(
      //       `http://localhost:3000/items/${this.allItemsId[i]}`
      //     );
      //     if (result.status == 200) {
      //       allResults.push(true);
      //     } else {
      //       allResults.push(false);
      //     }
      //   }
      ///
      if (result.status == 200) {
        this.FoundErr = "";
        this.success = "Item is Deleted...";
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
    },
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
