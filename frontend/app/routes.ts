import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/chat", "routes/chat.tsx")
] satisfies RouteConfig;
