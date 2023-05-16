/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
import CatalogView from "@/views/CatalogView";
import ComponentView from "@/views/ComponentView";
import ExperimentView from "@/views/ExperimentView";
import RunLogView from "@/views/RunLogView";
import ComponentLogView from "@/views/ComponentLogView";
import RunView from "@/views/RunView";
import PropertiesView from "@/views/PropertiesView";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "catalog",
    component: CatalogView,
  },
  {
    path: "/experiment/:id",
    component: ExperimentView,
    props: true,
  },
  {
    path: "/experiment/:id/runs",
    component: RunView,
    props: true,
  },
  {
    path: "/experiment/:id/runs/properties",
    component: PropertiesView,
    props: true,
  },
  {
    path: "/experiment/:experiment_id/runs/:instance_id",
    component: ComponentView,
    props: true,
  },
  {
    path: "/experiment/:experimentId/logs/:instanceId",
    component: RunLogView,
    props: true,
  },
  {
    path: "/experiment/:experimentId/logs/:instanceId/:componentId",
    component: ComponentLogView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

export default router;
