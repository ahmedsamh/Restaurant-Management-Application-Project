<template>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Login</h1>
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.email.$error }"
        >
          <input
            type="email"
            class="w250 form-control"
            id="floatEmailIs"
            placeholder="Your Email is"
            v-model.trim="state.email"
          />
          <label for="floatEmailIs">Your Email is</label>
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
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
            placeholder="Your password is"
            v-model.trim="state.pass"
          />
          <label for="floatPassIs">Your password is</label>
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="LoginNow()" class="w250 btn btn-success">
          Login
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="submit"
          @click="redirectTo({ to: 'Signup' })"
          class="w250 btn btn-primary"
        >
          Don't Have Account, Sign Up
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
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
  name: "LoginForm",
  // Composition APi another way
  setup() {
    const state = reactive({
      email: "",
      pass: "",
    });
    // Validations بديل
    const rules = computed(() => {
      return {
        email: { required, email },
        pass: { required, minLength: minLength(6) },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      FoundErr: "",
      success: "",
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
    async LoginNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("FORM VALIDATIONS SUCCES");
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&pass=${this.state.pass}`
        );
        console.log(result);
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          this.success = "Loading.....";
          this.FoundErr = "";
          setTimeout(() => {
            this.redirectTo({ to: "Home" });
          }, 2000);
        } else {
          this.success = "";
          this.FoundErr = "User Not Found!";
        }
      } else {
        this.success = "";
        this.FoundErr = "You must Enter Your Email and Password fields!";
      }
    },
    // SignUpPage() {
    //   this.$router.push({ name: "Signup" });
    // },
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
