<template>
  <Navbar />
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Your Profile</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div class="image">
            <img :src="photoUrl" alt="" />
          </div>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            disabled
            type="text"
            class="form-control"
            placeholder="Enter Your Name"
            v-model="name"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            disabled
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            disabled
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            v-model="pass"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            @click="updateProfile()"
            class="btn btn-warning"
          >
            Update Profile
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
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "ProfileForm",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      name: "",
      email: "",
      pass: "",
      photoUrl: null,
    };
  },
  async mounted() {
    try {
      // Fetch user data from the server (JSON Server)
      const userId = JSON.parse(localStorage.getItem("user-info")).id;
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const userData = response.data;

      // Set user data properties, including the photoUrl
      this.name = userData.name;
      this.email = userData.email;
      this.pass = userData.pass;
      this.photoUrl = userData.photoUrl;

      console.log(this.photoUrl);
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.redirectTo({ to: "Signup" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    updateProfile() {
      this.redirectTo({ to: "UpdateProfile" });
    },
  },
};
</script>



<style lang="scss" scoped>
.image {
  width: 200px;
  height: 200px;
}
.image img {
  border-radius: 50%;
  border: 1px solid black;
  width: 100%;
}
</style>
