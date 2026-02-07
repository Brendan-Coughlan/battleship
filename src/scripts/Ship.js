// configuration of the ship
// the length of the ship is always 1, but it is ocnfigurable
const config = {
  length: 1,
};

class Ship {
  /**
   *
   * @param {*} width the height of the ship
   * @param {*} color the color of the ship
   */
  constructor(width, color) {
    // the size of the ship
    this.width = width;
    this.length = config.length;
    //
    this.color = color;
    // # of times the ship being hit
    this.hits = 0;
  }

  /**
   * when the ship was hit, call hit funciton
   */
  hit() {
    this.hits++;
  }

  /**
   * determine whether the ship is sunk
   * @returns true if the ship is sunk
   */
  isSunk() {
    return this.hits >= this.length * this.width;
  }
}

export { Ship };
