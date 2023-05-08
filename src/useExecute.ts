// @ts-ignore
import {onMounted, onActivated, onUnmounted, onDeactivated} from "vue";
// @ts-ignore
import {useRoute} from "vue-router";

type ExeFunc = () => unknown | Promise<unknown>
type ExeReturn = [boolean, () => void];

function __cycleExecute(
  cachedEffect: (f: ExeFunc) => unknown,
  uncachedEffect: (f: ExeFunc) => unknown,
  func: ExeFunc
) {
  const $route = useRoute();
  let instance = () => (cachedEffect(() => {func();}));
  // 不被缓存或为携带参数页时转化为不缓存副作用
  if ($route.meta.uncached || Object.keys($route.query).length !== 0) {
    instance = () => uncachedEffect(() => {func();});
  }
  console.log("instance", instance(), instance, cachedEffect);
  return instance;
}

/**
 * 使用组件主执行体辅助函数
 * @param {() => (void | Promise<void>)} func 执行体
 * @param {boolean} execute 是否在内部执行
 * @return {(boolean | (() => void))[]} [是否已执行, 执行实例]
 */
export function useMain(func: ExeFunc, execute = true): ExeReturn {
  const instance = __cycleExecute(onActivated, onMounted, func);
  execute && instance();
  return [execute, instance];
}

/**
 * 使用组件退出执行体辅助函数
 * @param {() => (void | Promise<void>)} func 执行体
 * @param {boolean} execute 是否在内部执行
 * @return {(boolean | (() => void))[]} [是否已执行, 执行实例]
 */
export function useExit(func: ExeFunc, execute = true): ExeReturn {
  const instance = __cycleExecute(onDeactivated, onUnmounted, func);
  execute && instance();
  return [execute, instance];
}

