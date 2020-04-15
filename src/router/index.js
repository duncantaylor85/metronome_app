import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AddBars from "../views/AddBars.vue";
import EditBars from "../views/EditBars.vue";
import DeleteBars from "../views/DeleteBars.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/add",
    name: "AddBars",
    component: AddBars
  },
  {
    path: "/edit",
    name: "EditBars",
    component: EditBars
  },
  {
    path: "/delete",
    name: "DeleteBars",
    component: DeleteBars
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
