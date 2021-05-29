import Companies from "./components/Companies";
import PriceHistories from "./components/PriceHistories";
import Watchlists from "./components/Watchlists";
import FinancialReports from "./components/FinancialReports";
import CompetitiveFinancialReports from "./components/FinancialReports/CompetitiveFinancialReports";
import WatchlistForm from "./components/Watchlists/Form";
import Portfolio from "./components/ShareTransactions";
import PortfolioForm from "./components/ShareTransactions/Form";

const routes = [
  {
    path: "/index",
    name: "Price Histories",
    visible: true,
    icon: "ni ni-atom text-primary",
    component: PriceHistories,
    layout: "/admin",
  },
  {
    path: "/companies",
    name: "Companies",
    visible: true,
    icon: "ni ni-atom text-blue",
    component: Companies,
    layout: "/admin",
  },
  {
    path: '/watchlist/:id/edit',
    visible: false,
    component: WatchlistForm,
    layout: "/admin",
  },
  {
    path: '/watchlist/new',
    visible: false,
    component: WatchlistForm,
    layout: "/admin",
  },
  {
    path: '/financial-reports',
    name: 'Financial Reports',
    visible: true,
    icon: "ni ni-atom text-red",
    component: FinancialReports,
    layout: "/admin",
  },
  {
    path: '/competitive-financial-reports',
    name: 'Competitive Financial Reports',
    visible: true,
    icon: "ni ni-atom text-red",
    component: CompetitiveFinancialReports,
    layout: "/admin",
  },
  {
    path: '/watchlist/:id/edit',
    visible: false,
    component: WatchlistForm,
    layout: "/admin",
  },
  {
    path: '/watchlist/new',
    visible: false,
    component: WatchlistForm,
    layout: "/admin",
  },
  {
    path: '/watchlist',
    name: 'Watchlist',
    visible: true,
    icon: "ni ni-atom text-red",
    component: Watchlists,
    layout: "/admin",
  },
  {
    path: '/portfolio/:id/edit',
    visible: false,
    component: PortfolioForm,
    layout: "/admin",
  },
  {
    path: '/portfolio/new',
    visible: false,
    component: PortfolioForm,
    layout: "/admin",
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    visible: true,
    icon: "ni ni-atom",
    component: Portfolio,
    layout: "/admin",
  },
];
export default routes;