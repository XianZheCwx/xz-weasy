import { onMounted, onActivated, onUnmounted, onDeactivated } from "vue";
import { useRoute } from "vue-router";
function __cycleExecute(cachedEffect, uncachedEffect, func) {
    const $route = useRoute();
    let instance = () => uncachedEffect(() => { func(); });
    if ($route.meta.cached && Object.keys($route.query).length === 0) {
        instance = () => (cachedEffect(() => { func(); }));
    }
    return instance;
}
export function useMain(func, execute = true) {
    const instance = __cycleExecute(onActivated, onMounted, func);
    execute && instance();
    return [execute, instance];
}
export function useExit(func, execute = true) {
    const instance = __cycleExecute(onDeactivated, onUnmounted, func);
    execute && instance();
    return [execute, instance];
}
