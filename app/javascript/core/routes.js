import Companies from "./components/Companies";
import PriceHistories from "./components/PriceHistories";


const navbarSection = [
  {
    name: 'Companies',
    path: '/dashboard/companies',
    component: Companies
  },
  {
    name: 'Price Histories',
    path: '/dashboard/price-histories',
    component: PriceHistories,
  },
]

const routes = [...navbarSection];

export default routes;