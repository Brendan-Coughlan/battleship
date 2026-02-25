/* =========================
   Timer
========================= */
export class Timer {
  /**
   * Constructor of timer
   * @param {*} p p5 instance
   * @param {*} x X coordinate where the timer text will be displayed
   * @param {*} y Y coordinate where the timer text will be displayed
   * @param {*} seconds total countdown time
   */
  constructor(p, x, y, seconds) {
    this.p = p;
    this.x = x;
    this.y = y;

    // initial duration
    this.initial = seconds;
    // remaining time
    this.remaining = seconds;
    // whether timer is counting down
    this.running = false;
    // last timestamp used to compute delta time
    this.lastMs = p.millis();
  }

  /**
   * Start the timer
   * @param {number} seconds Duration to start the timer with
   */
  start(seconds = this.initial) {
    this.initial = seconds;
    this.remaining = seconds;
    this.running = true;
    this.lastMs = this.p.millis();
  }

  /**
   * Update the remaining time, should be called every frame
   * @returns
   */
  update() {
    if (!this.running) return;

    const now = this.p.millis();
    // convert milliseconds to seconds
    const dt = (now - this.lastMs) / 1000;
    this.lastMs = now;

    this.remaining -= dt;
    if (this.remaining < 0) this.remaining = 0;
  }

  /**
   * Renders the timer on the screen and update
   */
  render() {
    this.update();

    const p = this.p;
    const text = `Time: ${Math.ceil(this.remaining)}`;

    p.push();

    const fontSize = 36;
    p.textSize(fontSize);

    p.textAlign(p.CENTER, p.CENTER);

    // measure text
    const paddingX = 25;
    const paddingY = 15;
    const w = p.textWidth(text) + paddingX * 2;
    const h = fontSize  + paddingY * 2;

    // draw rectangle background
    p.rectMode(p.CENTER);
    p.fill(255); // white background
    p.stroke(0); // border
    p.strokeWeight(3);
    p.rect(this.x, this.y, w, h, 10); // rounded corners

    // draw text
    p.noStroke();
    p.fill(0);
    p.text(text, this.x, this.y);

    p.pop();
  }

  /**
   * Pause the timer
   */
  pause() {
    this.running = false;
  }

  /**
   * Resumes countdown from current remaining time
   * @returns
   */
  resume() {
    if (this.remaining <= 0) return;
    this.running = true;
    this.lastMs = this.p.millis();
  }

  /**
   * Resets reamaining time to a specified time but does not start
   * @param {*} seconds
   */
  reset(seconds = this.initial) {
    this.remaining = seconds;
    this.lastMs = this.p.millis();
  }

  /**
   * Check whether the timer has reached zero
   * @returns {boolean} True if countdown finished
   */
  isFinished() {
    return this.remaining <= 0;
  }
}
