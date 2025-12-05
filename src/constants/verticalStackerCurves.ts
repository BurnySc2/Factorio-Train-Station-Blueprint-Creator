import type { iBlueprintItemWithoutNumber } from "./interfaces"

// (0, 0) bending left 90 degrees to (-1, 1) curve
export const frontLeftCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "curved-rail",
		position: {
			x: 0,
			y: 0,
		},
	},
	{
		name: "straight-rail",
		position: {
			x: -4,
			y: -4,
		},
		direction: 1,
	},
	{
		name: "curved-rail",
		position: {
			x: -6,
			y: -6,
		},
		direction: 3,
	},
	{
		name: "straight-rail",
		position: {
			x: -11,
			y: -8,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: -13,
			y: -8,
		},
		direction: 2,
	},
]
// (0, 0) bending right 90 degrees to (1, 1) curve
export const frontRightCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "curved-rail",
		position: {
			x: 2,
			y: 0,
		},
		direction: 1,
	},
	{
		name: "straight-rail",
		position: {
			x: 5,
			y: -3,
		},
		direction: 7,
	},
	{
		name: "curved-rail",
		position: {
			x: 8,
			y: -6,
		},
		direction: 6,
	},
	{
		name: "straight-rail",
		position: {
			x: 13,
			y: -7,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: 15,
			y: -7,
		},
		direction: 2,
	},
]
// (-1, -1) bending left 90 degreses to (0, 0)  curve
export const backLeftCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "curved-rail",
		position: {
			x: 0,
			y: 6,
		},
		direction: 5,
	},
	{
		name: "straight-rail",
		position: {
			x: -3,
			y: 9,
		},
		direction: 3,
	},
	{
		name: "curved-rail",
		position: {
			x: -6,
			y: 12,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: -11,
			y: 13,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: -13,
			y: 13,
		},
		direction: 2,
	},
]
// (1, -1) bending right 90 degreses to (0, 0)  curve
export const backRightCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "curved-rail",
		position: {
			x: 2,
			y: 5,
		},
		direction: 4,
	},
	{
		name: "straight-rail",
		position: {
			x: 5,
			y: 9,
		},
		direction: 5,
	},
	{
		name: "curved-rail",
		position: {
			x: 8,
			y: 11,
		},
		direction: 7,
	},
	{
		name: "straight-rail",
		position: {
			x: 13,
			y: 13,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: 15,
			y: 13,
		},
		direction: 2,
	},
]
