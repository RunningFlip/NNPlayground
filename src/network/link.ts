
export class Link {

    public readonly id: number;
    public weight: number;

    constructor(id: number, weight?: number) {
        this.id = id;
        this.weight = weight ?? Math.random();
    }
}