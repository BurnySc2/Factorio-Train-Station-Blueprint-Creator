import type { iBlueprintItemWithoutNumber } from "./interfaces"

// (0, 0) bending left 45 degrees to (-1, 2) curve
// The diagonal should be a bottomright-to-topright diagonal with the ending rail piece being the topleft piece
export const diagonalFrontLeftCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "curved-rail",
		position: {
			x: 0,
			y: 0,
		},
		direction: 5,
	},
	{
		name: "straight-rail",
		position: {
			x: -1,
			y: -7,
		},
		direction: 0,
	},
	{
		name: "straight-rail",
		position: {
			x: -1,
			y: -9,
		},
		direction: 0,
	},
	{
		name: "rail-chain-signal",
		position: {
			x: -3.5,
			y: 4.5,
		},
		direction: 5,
	},
]
// (0, 0) bending right 45 degrees to (2, 1) curve
// The diagonal should be a bottomright-to-topright diagonal with the ending rail piece being the topleft piece
export const diagonalFrontRightCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "straight-rail",
		position: {
			x: 1,
			y: 0,
		},
		direction: 7,
	},
	{
		name: "curved-rail",
		position: {
			x: 4,
			y: -2,
		},
		direction: 6,
	},
	{
		name: "straight-rail",
		position: {
			x: 9,
			y: -3,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: 11,
			y: -3,
		},
		direction: 2,
	},
	{
		name: "rail-chain-signal",
		position: {
			x: 2.5,
			y: 0.5,
		},
		direction: 5,
	},
]
// (-2, -1) bending left 45 degreses to (0, 0) curve
export const diagonalBackLeftCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "straight-rail",
		position: {
			x: -9 - 6,
			y: 13 - 4,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: -7 - 6,
			y: 13 - 4,
		},
		direction: 2,
	},
	{
		name: "curved-rail",
		position: {
			x: -8,
			y: 8,
		},
		direction: 2,
	},
	{
		name: "straight-rail",
		position: {
			x: -5,
			y: 5,
		},
		direction: 3,
	},
	{
		name: "rail-signal",
		position: {
			x: -5.5 + 2,
			y: 8.5 - 2,
		},
		direction: 5,
	},
]
// (1, -2) bending right 45 degreses to (0, 0) curve
export const diagonalBackRightCurve: iBlueprintItemWithoutNumber[] = [
	{
		name: "straight-rail",
		position: {
			x: -1 - 6,
			y: 9,
		},
		direction: 0,
	},
	{
		name: "straight-rail",
		position: {
			x: -1 - 6,
			y: 11,
		},
		direction: 0,
	},
	{
		name: "curved-rail",
		position: {
			x: -4,
			y: 6,
		},
		direction: 1,
	},
	{
		name: "rail-signal",
		position: {
			x: -2.5,
			y: 3.5,
		},
		direction: 5,
	},
]
