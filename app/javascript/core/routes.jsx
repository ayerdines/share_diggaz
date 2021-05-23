import Companies from "./components/Companies";
import PriceHistories from "./components/PriceHistories";

const routes = [
  {
    path: "/index",
    name: "Price Histories",
    icon: "ni ni-tv-2 text-primary",
    component: PriceHistories,
    layout: "/admin",
  },
  {
    path: "/companies",
    name: "Companies",
    icon: "ni ni-planet text-blue",
    component: Companies,
    layout: "/admin",
  },
];
export default routes;