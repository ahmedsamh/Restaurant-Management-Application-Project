<template>
  <Navbar />
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Add New Restaurant</h1>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Restaurant name"
          v-model.trim="state.name"
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
          type="text"
          class="form-control"
          placeholder="Phone Numaber"
          v-model.trim="state.phone"
        />
        <span class="error-feedback" v-if="v$.phone.$error">{{
          v$.phone.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Address"
          v-model.trim="state.address"
        />
        <span class="error-feedback" v-if="v$.address.$error">{{
          v$.address.$errors[0].$message
        }}</span>
      </div>
      <br />
      <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button type="button" @click="addLocation()" class="btn btn-primary">
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
    </div>
  </form>
  <footerLine />
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import footerLine from "@/components/Header/footer.vue";
import { mapActions } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
  name: "AddNewLocation",
  components: {
    Navbar,
    footerLine,
  },
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });
    // Validations بديل
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(3) },
        phone: { required, minLength: minLength(11) },
        address: { required, minLength: minLength(10) },
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
      userId: "",
      FoundErr: "",
      success: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ to: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async addLocation() {
      this.v$.$validate(); // activate validations
      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/locations`, {
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
          userId: this.userId,
        });
        if (result.status == 201) {
          this.FoundErr = "";
          this.success = "Added New Location!";
          // redirect To Home Page
          // use this becuase redirect is method inside another method
          setTimeout(() => {
            this.redirectTo({ to: "Home" });

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
</style>
