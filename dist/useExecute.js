import { onMounted, onActivated, onUnmounted, onDeactivated } from "vue";
import { useRoute } from "vue-router";
function __cycleExecute(cachedEffect, uncachedEffect, func) {
    const $route = useRoute();
    let instance = () => (cachedEffect(() => { func(); }));
    if ($route.meta.uncached || Object.keys($route.query).length !== 0) {
        instance = () => uncachedEffect(() => { func(); });
    }
    console.log("instance", instance(), instance, cachedEffect);
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
