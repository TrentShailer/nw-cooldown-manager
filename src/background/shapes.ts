class Polygon {
	public points: Array<Vector2> = new Array<Vector2>();
	public middlePoint: Vector2;

	constructor(points: Array<Vector2>, middlePoint: Vector2) {
		this.points = points;
		this.middlePoint = middlePoint;
	}

	public isPointInside(point: Vector2): boolean {
		// Get middle point relative to point
		let relative: Vector2 = new Vector2(
			this.middlePoint.x - point.x,
			this.middlePoint.y - point.y
		);
		// get the length and
		let length = Math.sqrt(Math.pow(relative.x, 2) + Math.pow(relative.y, 2));
		let desiredLength = 20000;
		let multiplier = desiredLength / length;

		let castToPoint: Vector2 = new Vector2(
			point.x + relative.x * multiplier,
			point.y + relative.y * multiplier
		);
		let rayLine: Line = new Line(point, castToPoint);

		let numOfIntersections: number = 0;
		let intersectionIndexes: Array<Number> = new Array<Number>();

		for (let i = 0; i < this.points.length; i++) {
			let secondPointIndex = i + 1 === this.points.length ? 0 : i + 1;
			let segment: Line = new Line(this.points[i], this.points[secondPointIndex]);

			if (rayLine.IntersectsWith(segment)) {
				numOfIntersections++;
				intersectionIndexes.push(i);
				intersectionIndexes.push(secondPointIndex);
			}
		}

		if (numOfIntersections % 2 === 0) return false;
		return true;
	}
}

class Line {
	public p1: Vector2;
	public p2: Vector2;

	constructor(p1: Vector2, p2: Vector2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	private direction(a: Vector2, b: Vector2, c: Vector2): number {
		let val: number = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
		// co-linear
		if (val === 0) return 0;
		else if (val < 0) return 2; // anti-clockwise
		return 1; // clockwise
	}

	public IntersectsWith(other: Line): boolean {
		let dir1: number = this.direction(this.p1, this.p2, other.p1);
		let dir2: number = this.direction(this.p1, this.p2, other.p2);
		let dir3: number = this.direction(other.p1, other.p2, this.p1);
		let dir4: number = this.direction(other.p1, other.p2, this.p2);

		if (dir1 != dir2 && dir3 != dir4) return true;
		// Ignore co-linear cases
		return false;
	}
}

class Vector2 {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export { Vector2, Line, Polygon };
