import { createRouter, createWebHistory, next } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Signup from "../views/signup.vue";
import LogIn from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import ErrorPage from "../views/ErrorPage.vue";
import UpdateProfile from "../components/Profile/UpdateProfile.vue";
import AddNewLocation from "../components/Locations/AddNewLocation.vue";
import DeleteLocation from "../components/Locations/DeleteLocation.vue";
import DeleteAllLocations from "../components/Locations/DeleteAllLocations.vue";
import UpdateLocation from "../components/Locations/UpdateLocation.vue";
import Menu from "../components/Menu/Menu.vue";
import AddNewCategory from "../components/Menu/AddNewCategory.vue";
import ViewCategories from "../components/Menu/ViewCategories.vue";
import UpdateCategory from "../components/Menu/UpdateCategory.vue";
import DeleteCategory from "../components/Menu/DeleteCategory.vue";
import DeleteAllCategories from "../components/Menu/DeleteAllCategories.vue";
import addNewItem from "../components/Menu/addNewItem.vue";
import updateItem from "../components/Menu/updateItem.vue";
import DeleteItem from "../components/Menu/DeleteItem.vue";
import DeleteAllItems from "../components/Menu/DeleteAllItems.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/sign-up",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/Login",
    name: "LogIn",
    component: LogIn,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/Update-Profile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/Add-New-Location",
    name: "AddNewLocation",
    component: AddNewLocation,
  },
  {
    path: "/DeleteLocation/:locationId",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  {
    path: "/Delete-All-Locations",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/Menu/Location/:locationID",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/Menu/Categories/add/:locationID",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/Menu/Item/add/:locationId",
    name: "addNewItem",
    component: addNewItem,
  },
  {
    path: "/Menu/update/Item/:itemId/loc/:locationId",
    name: "updateItem",
    component: updateItem,
  },
  {
    path: "/Menu/item/:itemId/delete/loc/:locationId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/Menu/items/delete-all/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItems,
  },
  {
    path: "/Menu/Categories/update/:locationID/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/Menu/Categories/delete/:locationID/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/Menu/Categories/view/:locationID",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/Menu/Categories/delete-all-categories/:locationId",
    name: "DeleteAllCategories",
    component: DeleteAllCategories,
  },
  {
    path: "/Update-Location/:locationId",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.afterEach((to, from, next) => {
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if (to.name == null) {
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE}`;
    } else {
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }
});
export default router;
