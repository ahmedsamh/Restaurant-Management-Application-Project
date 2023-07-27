<template>
  <Navbar />
  <div class="restName">
    <div class="container">
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button type="button" class="float-start btn btn-primary">
          View/Add Categories
        </button>
      </router-link>
      <router-link
        :to="{ name: 'addNewItem', params: { locationId: locationId } }"
      >
        <button
          type="button"
          class="float-end btn btn-primary"
          v-if="numOfCategories > 0"
        >
          Add New Items
        </button>
      </router-link>
      <div class="clearfix"></div>
      <div class="text-center">
        <h1 class="mb0">{{ locName }}</h1>
        <p class="text-muted">{{ locAddress }}</p>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <div class="container">
    <router-link
      v-if="listOfUserCategory.length > 0"
      :to="{ name: 'DeleteAllItems', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-danger float-end" v-if="numOfCategories > 0">
        Delete All Items
      </button>
    </router-link>
    <div class="clearfix"></div>

    <br />
    <div class="each-category">
      <div class="" v-for="(cat, i) in listOfUserCategory" :key="i">
        <div class="row">
          <div class="row col-12 catName">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
          <div 
            v-for="(item, h) in listOfUserItem"
            :key="h"
            v-show="cat.id == item.catId"
            :class= "{ 'col-xs-12 col-sm-4 px-4': cat.id == item.catId }"
          >
            <div
              v-if="cat.id == item.catId"
              :class="{ 'each-item  border border-primary-subtle rounded-3 p-3': cat.id == item.catId }"
            >
              <h4 class="item-name text-center">{{ item.name }}</h4>
              <p class="item-description text-muted">{{ item.description }}</p>
              <div>
                <div class="available-items float-start text-muted">
                  Available Qty : {{ numberWithCommas(item.qty) }}
                </div>
                <div class="item-price float-end text-muted">
                  {{ numberWithCommas(item.price) }}
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="p-1 mt-2">
                <div class="available-items float-start">
                  <router-link
                    :to="{
                      name: 'updateItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-start btn btn-info">
                      Update
                    </button>
                  </router-link>
                </div>
                <div class="item-price float-end">
                  <router-link
                    :to="{
                      name: 'DeleteItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-start btn btn-danger">
                      Delete
                    </button>
                  </router-link>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <hr />
          </div>
        </div>
        <br />
      </div>
      <!-- <div>
      is user logged in? {{ isUserLoggedIn }} <br />
      user Id? {{ LoggedInUserId }} <br />
      num of categories? {{ numOfCategories }} <br />
      list of categories? {{ listOfCategories }}
    </div> -->
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
  name: "Menu_",
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
      listOfUserCategory: "",
      listOfUserItem: "",
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
      this.getCurrentUserCategory(this.userId, this.locationId);
      this.getCurrentUserItem(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]), // استدعيت ال functions
    ...mapActions(["redirectTo"]),
    async getCurrentUserCategory(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserCategory = result.data;
        console.table(this.listOfUserCategory);
      }
    },
    async getCurrentUserItem(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserItem = result.data;
        console.table(this.listOfUserItem);
      }
    },
    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
  },
};
</script>

<style scoped>
.mb0 {
  margin-bottom: 0;
}
.item-description {
  padding-top: 12px;
  min-height: 110px;
}
.restName {
  background-color: #D4E2D4;
  margin-top: -50px;
  margin-bottom: 10px;
  padding-top: 50px;
  padding-bottom: 20px;
}
.each-item{
  background-color: #D4E2D4;

}
.catName{
  margin-bottom: 20px;
}
</style>
