 
 import { useRoutes } from "react-router-dom";
 import { routerMap } from "./routerMap.tsx";
 
 function Router() {
     const routerTab = useRoutes(routerMap); //注册前端路由表
 
     return routerTab;
 }
 
 export default Router;
 