import Companies from "./components/Companies";
import PriceHistories from "./components/PriceHistories";
import Watchlists from "./components/Watchlists";
import FinancialReports from "./components/FinancialReports";
import SectorwiseFinancialReports from "./components/FinancialReports/SectorwiseFinancialReports";
import WatchlistForm from "./components/Watchlists/Form";
import Portfolio from "./components/ShareTransactions";
import PortfolioForm from "./components/ShareTransactions/Form";
import UserForm from "./components/Users/Form";
import Users from "./components/Users";
import FinancialReportForm from "./components/FinancialReports/Form";

const routes = [
  {
    path: "/index",
    name: "Price Histories",
    visible: true,
    icon: "ni ni-sound-wave text-primary",
    component: PriceHistories,
    layout: "/admin",
  },
  {
    path: "/companies",
    name: "Companies",
    visible: true,
    icon: "ni ni-building text-danger",
    component: Companies,
    layout: "/admin",
    role: 'admin'
  },
  {
    path: '/watchlists/:id/edit',
    visible: false,
    component: WatchlistForm,
    layout: "/admin",
  },
  {
    path: '/watchlists/new',
    visible: false,
    component: WatchlistForm,
    layout: "/admin",
  },
  {
    path: '/watchlists',
    name: 'Watchlist',
    visible: true,
    icon: "ni ni-watch-time text-info",
    component: Watchlists,
    layout: "/admin",
  },
  {
    path: '/financial-reports/new',
    visible: false,
    component: FinancialReportForm,
    layout: "/admin",
  },
  {
    path: '/financial-reports/:id/edit',
    visible: false,
    component: FinancialReportForm,
    layout: "/admin",
  },
  {
    path: '/financial-reports',
    name: 'Financial Reports',
    visible: true,
    icon: "ni ni-books text-warning",
    component: FinancialReports,
    layout: "/admin",
  },
  {
    path: '/sectorwise-financial-reports',
    name: 'Sector-wise Financial Reports',
    visible: true,
    icon: "ni ni-chart-bar-32 text-success",
    component: SectorwiseFinancialReports,
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
    name: 'Share Transactions',
    visible: true,
    icon: "ni ni-chart-pie-35",
    component: Portfolio,
    layout: "/admin",
  },
  {
    path: '/users/:id/edit',
    visible: false,
    component: UserForm,
    layout: "/admin",
    role: 'admin'
  },
  {
    path: '/users/new',
    visible: false,
    component: UserForm,
    layout: "/admin",
    role: 'admin'
  },
  {
    path: '/users',
    name: 'Users',
    visible: true,
    icon: "ni ni-circle-08 text-pink",
    component: Users,
    layout: "/admin",
    role: "admin"
  },
];
export default routes;