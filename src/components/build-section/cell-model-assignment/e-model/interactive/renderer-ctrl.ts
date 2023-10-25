/**
 * A helper class used for control when the current view needs to be re-rendered.
 * This reduces the stress on the GPU in comparison to an always running render loop.
 */
export default class RendererCtrl {
  private nCountinuousRenderRequests: number = 0;

  private once: boolean = true;

  private stopTime: number | null = null;

  get needsRender() {
    if (this.nCountinuousRenderRequests) return true;

    if (this.stopTime) {
      const now = Date.now();
      if (this.stopTime > now) return true;

      this.stopTime = null;
      return false;
    }

    const { once } = this;
    this.once = false;
    return once;
  }

  /**
   * Request a single render.
   */
  renderOnce() {
    this.once = true;
  }

  /**
   * Request a continuous render (loop) for a certain time period (in milliseconds).
   */
  renderFor(time: number) {
    const now = Date.now();
    if (this.stopTime && this.stopTime > now + time) return;
    this.stopTime = now + time;
  }

  /**
   * Request a continouos render (loop) until explicitly stopped.
   */
  renderUntilStopped() {
    this.nCountinuousRenderRequests += 1;
    return () => {
      this.nCountinuousRenderRequests -= 1;
    };
  }
}
