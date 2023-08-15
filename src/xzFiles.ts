/*
 * 文件处理类型声明
 * filesHandle.ts
 */

// 文件对象类型
export type FileType = File | Blob & { name?: string };

// 文件配置属性
export interface FileConfig {
  // 文件名
  filename: string;
  // 文件类型
  type: string;
}

// 轮询器参数
export namespace Poller {
  export type Fn = (success: () => void, fail: () => void,
                    ...args: unknown[]) => Promise<unknown>;
  export type FailFn = (...args: unknown[]) => unknown;

  export interface Args {
    fn: Fn;
    failFn?: FailFn;
    meta?: unknown;
    interval?: number;
    timeout?: number;
  }
}


/**
 * 读取二进制文件
 * @param {ArrayBuffer} bytes 二进制数据
 * @param {FileConfig} config 配置项
 * @return {File} 文件对象
 */
export function loadsBytes(bytes: ArrayBuffer, config: FileConfig = {
  filename: "file",
  type: "application/octet-stream"
}): File {
  return new File([bytes], config.filename, config);
}

/**
 * 文件下载函数「同步」
 * @param file File或则Blob对象
 * @param filename 文件名, 若未指定则尝试使用file对象name属性
 */
export function downloadFileSync(file: FileType | string,
                                 filename?: string): void {
  const aEle = document.createElement("a");
  let fileUrl;
  if (file.constructor === String && /^http/.test(file)) {
    fileUrl = file;
  } else {
    // @ts-ignore
    fileUrl = URL.createObjectURL(file);
  }
  aEle.id = `__download_${Math.trunc(Math.random() * 100000)}`;
  aEle.style.display = "none";
  aEle.href = fileUrl;
  if (file.constructor === File) {
    aEle.download = filename || file.name || "unknown";
  } else {
    aEle.download = filename || "unknown";
  }
  document.body.appendChild(aEle);
  aEle.click();
  document.body.removeChild(aEle);
  URL.revokeObjectURL(fileUrl);
}

// 文件下载函数「异步」
export async function downloadFile(file: FileType | string, ...args: any[]) {
  await downloadFileSync(file, ...args);
}

/**
 * 文件状态轮询器
 * @param fn 执行函数体
 * @param failFn 执行失败函数体
 * @param meta 传递给执行函数参数
 * @param interval 轮询间隔
 * @param timeout 超时时间
 * @return {Promise<unknown>}
 */
export function poller<T = unknown>(
  { fn, failFn, meta, interval = 300, timeout = 3000 }: Poller.Args
): Promise<T> {
  // 起始时间戳
  const startTimeStamp = (new Date()).getTime();
  // 轮询结束上下文
  const overCtx: Record<string, unknown> = {};
  let _Succ_State = false, _Fail_State = false, count = 0;
  // 触发轮询成功执行体
  const success = (successMeta?: unknown) => {
    _Succ_State = true;
    successMeta && (overCtx.successMeta = successMeta);
  };
  // 触发轮询失败执行体
  const fail = (failMeta?: unknown) => {
    _Fail_State = true;
    failMeta && (overCtx.failMeta = failMeta);
  };

  return new Promise((resolve, reject) => {
    // 定时器对象
    const timerObj = window.setInterval(async () => {
      const msg = await fn(success, fail, meta);
      count++;

      if (_Succ_State) {
        // 结束定时器线程
        clearInterval(timerObj);
        resolve(msg as T);
      }
      // 手动抛出失败或超时失败
      if (_Fail_State || ((new Date()).getTime() - startTimeStamp > timeout)) {
        // 结束定时器线程
        clearInterval(timerObj);
        if (failFn) {
          const msg = failFn(meta, { ...overCtx, count });
          return resolve(msg as T);
        }
        // 未指定错误回调情况下抛出异常
        reject("The poller timed out");
      }
    }, interval);
  });
}

/**
 * 图片转Base64辅助函数
 * @param src 图片地址
 * @return {Promise<string>} base64字符串
 */
export async function imgToBase64(src: string) {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  img.src = src;
  await new Promise<void>(resolve => {
    img.addEventListener("load", () => {
      canvas.width = img.width;
      canvas.height = img.height;
      resolve();
    });
  });
  ctx?.drawImage(img, 0, 0);
  return canvas.toDataURL("image/*", 1);
}
