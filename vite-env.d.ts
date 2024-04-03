import nprogress from 'nprogress'
declare module 'nprogress' {
  interface NProgress {
    start(): void
    done(): void
    // 其他方法和属性...
  }

  const nprogress: NProgress
  export default nprogress
}
