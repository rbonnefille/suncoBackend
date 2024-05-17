/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    'Home': RouteRecordInfo<'Home', '/', Record<never, never>, Record<never, never>>,
    '404': RouteRecordInfo<'404', '/:path(.*)', { path: ParamValue<true> }, { path: ParamValue<false> }>,
    'Dashboard': RouteRecordInfo<'Dashboard', '/dashboard', Record<never, never>, Record<never, never>>,
    'SunCo integrations': RouteRecordInfo<'SunCo integrations', '/sunco/integrations', Record<never, never>, Record<never, never>>,
    'SunCo Switchboard Configuration': RouteRecordInfo<'SunCo Switchboard Configuration', '/sunco/integrations/switchboard', Record<never, never>, Record<never, never>>,
    'Widget Snippets': RouteRecordInfo<'Widget Snippets', '/sunco/snippets/web-widget', Record<never, never>, Record<never, never>>,
    'Users': RouteRecordInfo<'Users', '/sunco/users', Record<never, never>, Record<never, never>>,
    'SunCo User': RouteRecordInfo<'SunCo User', '/sunco/users/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
  }
}
