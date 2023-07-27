<template>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Sign Up</h1>
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.email.$error }"
        >
        <input type="hidden" v-model="defaultPhotoUrl" />
          <input
            type="text"
            class="w250 form-control"
            id="floatTextIs"
            placeholder="Enter Your Name"
            v-model.trim="name"
          />
          <label for="floatTextIs">Enter Your Name</label>
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.email.$error }"
        >
          <input
            type="email"
            class="w250 form-control"
            id="floatEmailIs"
            placeholder="Enter Your Email"
            v-model.trim="email"
          />
          <label for="floatEmailIs">Your Email is</label>
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.pass.$error }"
        >
          <input
            type="password"
            class="w250 form-control"
            id="floatPassIs"
            placeholder="Enter Your Password"
            v-model.trim="pass"
          />
          <label for="floatPassIs">Enter Your Password</label>
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="validateEmailBeforeSignUp()" class="w250 btn btn-success">
          Sign Up Now
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="submit"
          @click="redirectTo({ to: 'LogIn' })"
          class="w250 btn btn-primary"
        >
          Have an Account, Login Now
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
</template>

<script>
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
export default {
  name: "SignUpForm",
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
      FoundErr: "",
      success: "",
      userEmailExists:"",
      defaultPhotoUrl: require("@/assets/avatar.png"),
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
      this.redirectTo({ to: "Home" });
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    // LoginPage() {
    //   this.$router.push({ name: "LogIn" });
    // },
    async validateEmailBeforeSignUp() {
      let res = await axios.get(
        `http://localhost:3000/users?email=${this.email}`
      );
      if (res.status == 200) {
        this.userEmailExists = res.data;
        if (this.userEmailExists.length != 1) {
          this.success = "";
          this.FoundErr = "";
          this.signUpNow(); 
        }else{
          this.success = "";
          this.FoundErr = "This Email already Exists..";
        }
      }
    },
    async signUpNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("FORM VALIDATIONS SUCCES");
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          pass: this.pass,
          photoUrl: this.defaultPhotoUrl,
        });
        if (result.status == 201) {
          console.log("ADDED New User");
          // Save user Date in local storage
          localStorage.setItem("user-info", JSON.stringify(result.data));
          // redirect To Home Page
          // use this becuase redirect is method inside another method
          this.success = "Loading.....";
          this.FoundErr = "";
          setTimeout(() => {
            this.redirectTo({ to: "Home" });
          }, 2000);
        } else {
          this.success = "";
          this.FoundErr = "Error!";
        }
      } else {
        this.success = "";
        this.FoundErr = "You must Enter Your Name , Email and Password fields!";
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
</style>
