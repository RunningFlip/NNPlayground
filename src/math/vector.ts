export class Vector {

    // --------------------------------------------------------------------------------
    // Fields
    // --------------------------------------------------------------------------------
    
    private values: number[];

    // --------------------------------------------------------------------------------
    // Properties
    // --------------------------------------------------------------------------------

    // Get size of the vector
    public get size(): number {

      return this.values.length;
    }

    // --------------------------------------------------------------------------------
    // Constructor
    // --------------------------------------------------------------------------------

    public constructor(size: number, initialValue: number = 0) {
        this.values = Array(size).fill(initialValue);
    }

    // --------------------------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------------------------

    // Get value at specific index
    public getValue(index: number): number {

      if (index < 0 || index >= this.size) {
        throw new Error('Index out of bounds');
      }
      return this.values[index];
    }

    // --------------------------------------------------------------------------------

    // Set value at specific index
    public setValue(index: number, value: number): void {

      if (index < 0 || index >= this.size) {
        throw new Error('Index out of bounds');
      }
      this.values[index] = value;
    }

    // --------------------------------------------------------------------------------

    // Dot product with another vector
    public dotProduct(other: Vector): number {

      if (this.size !== other.size) {
        throw new Error('Vectors must be of the same size for dot product');
      }

      let sum = 0;
      for (let i = 0; i < this.size; i++) {
        sum += this.values[i] * other.getValue(i);
      }
      return sum;
    }

    // --------------------------------------------------------------------------------
    
    // Print the vector
    public print(): void {
      console.log(this.values.join(' '));
    }
}