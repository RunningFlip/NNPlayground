import { Vector } from "./vector"

// --------------------------------------------------------------------------------

export class Matrix {

    // --------------------------------------------------------------------------------
    // Fields
    // --------------------------------------------------------------------------------

    private matrix: number[][];
    private rows: number;
    private columns: number;

    // --------------------------------------------------------------------------------
    // Properties
    // --------------------------------------------------------------------------------
  
    public get rowCount(): number {
        return this.rows;
    }

    public get columnCount(): number {
        return this.columns;
    }

    // --------------------------------------------------------------------------------
    // Constructor
    // --------------------------------------------------------------------------------
  
    public constructor(rows: number, columns: number, initialValue: number = 0) {
        this.rows = rows;
        this.columns = columns;
        this.matrix = Array.from({ length: rows }, () => Array(columns).fill(initialValue));
    }

    // --------------------------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------------------------
  
    // Get value at specific row and column
    public getValue(row: number, column: number): number {

        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns) {
            throw new Error('Index out of bounds');
        }
        return this.matrix[row][column];
    }

    // --------------------------------------------------------------------------------
  
    // Set value at specific row and column
    public setValue(row: number, column: number, value: number): void {

        if (row < 0 || row >= this.rows || column < 0 || column >= this.columns) {
            throw new Error('Index out of bounds');
        }
        this.matrix[row][column] = value;
    }

    // --------------------------------------------------------------------------------
  
    // Multiply this matrix with another matrix
    public multiply(other: Matrix): Matrix {

        if (this.columns !== other.rowCount) {
            throw new Error('Matrix dimensions do not match for multiplication');
        }
    
        const result = new Matrix(this.rows, other.columnCount);
    
        for (let i = 0; i < this.rows; i++) {

            for (let j = 0; j < other.columnCount; j++) {

                let sum = 0;
                
                for (let k = 0; k < this.columns; k++) {
                    sum += this.matrix[i][k] * other.getValue(k, j);
                }
                result.setValue(i, j, sum);
            }
        }
    
        return result;
    }

    // --------------------------------------------------------------------------------

    public multiplyVector(vector: Vector): Vector {

        if (this.columns !== vector.size) {
            throw new Error('Matrix columns must match vector size for multiplication');
        }
    
        const result = new Vector(this.rows);
    
        for (let i = 0; i < this.rows; i++) {
            let sum = 0;
            for (let j = 0; j < this.columns; j++) {
                sum += this.matrix[i][j] * vector.getValue(j);
            }
            result.setValue(i, sum);
        }
    
        return result;
    }

    // --------------------------------------------------------------------------------

    // Transpose the matrix
    public transpose(): Matrix {

        const transposed = new Matrix(this.columns, this.rows);
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                transposed.setValue(j, i, this.matrix[i][j]);
            }
        }
        return transposed;
    }

    // --------------------------------------------------------------------------------
  
    // Print the matrix
    publicprint(): void {
        console.log(this.matrix.map(row => row.join(' ')).join('\n'));
    }
}