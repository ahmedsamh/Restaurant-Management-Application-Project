<template>
  <Navbar />
  <div class="container">
    <form @submit.prevent="updateProfileNow">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Update Your Profile</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div class="image">
            <img :src="photoUrl" alt="Profile Photo" />
            <label for="imageUpload" class="icon">
              <input
                type="file"
                class="file"
                id="imageUpload"
                accept="image/*"
                @change="onFileChange"
              />
            </label>
          </div>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Your Name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            v-model="pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            @click="updateProfileNow()"
            class="btn btn-warning"
          >
            Update Profile Now
          </button>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto error-feedback">
          {{ updateErr }}
        </div>
      </div>
    </form>
  </div>
  <footerLine />
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import Navbar from "@/components/Header/Navbar.vue";
import footerLine from "@/components/Header/footer.vue";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
  name: "UpdateProfile",
  components: {
    Navbar,
    footerLine,
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
      userId: "",
      updateErr: "",
      selectedFile: null,
      photoUrl: null,
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      email: { required, email },
      pass: { required, minLength: minLength(6) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
      this.userId = JSON.parse(user).id;
      this.photoUrl = JSON.parse(user).photoUrl;
    } else {
      this.redirectTo({ to: "Signup" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.photoUrl = URL.createObjectURL(this.selectedFile);
    },
    async uploadPhoto() {
      const formData = new FormData();
      formData.append("file", this.photoUrl);

    },

    async updateProfileNow() {
      // Call the validation method before the profile update
      this.v$.$validate();

      if (!this.v$.$error) {
        // If validation passes, proceed with the photo upload
        try {
          const photoUrl = await this.uploadPhoto();
console.log(photoUrl)
          // Make a PUT request to update the profile with the new photo URL
          const updatedProfile = {
      name: this.name,
      email: this.email,
      pass: this.pass,
      photoUrl: this.photoUrl, // Use the uploaded photo URL from uploadPhoto method
    };

          const response = await axios.put(
            `http://localhost:3000/users/${this.userId}`,
            updatedProfile
          );

          if (response.status === 200) {
            // Profile updated successfully
            this.updateErr = "";
            // Update the user-info in localStorage with the new data
            const user = JSON.parse(localStorage.getItem("user-info"));
            localStorage.setItem(
              "user-info",
              JSON.stringify({ ...user, ...updatedProfile })
            );
            this.redirectTo({ to: "profile" });
          } else {
            this.updateErr = "Something went wrong, please try again.";
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          this.updateErr = "Something went wrong, please try again.";
        }
      } else {
        this.updateErr = "Please fix the form errors before submitting.";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 0.8em;
}
.image {
  position: relative;
  width: 200px;
  height: 200px;
}
.image img {
  border-radius: 50%;
  border: 1px solid black;
  width: 100%;
}

.icon {
  background-color: black;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 20px;
}
</style>
