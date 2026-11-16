/**
 * Host half of `dsh-plugin-manager-plus`.
 *
 * The bundle only contributes browser UI: the Plugins page gains categorized
 * views and localized names/summaries for installed plugins. Nothing on the
 * Host plane needs to run, so `apply` stays empty; the Host row still exists so
 * the package has a Loader entry the browser half can attach to.
 */
export function apply() {}
