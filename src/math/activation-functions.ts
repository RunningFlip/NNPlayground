
export function sigmoidFunc(value: number): number {
    return 0.5 * (1 + Math.tanh(value / 2));
}