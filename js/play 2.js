const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const px = 10;

const fps = 1000 / 60;

class flags {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.spawnX = x;
		this.spawnY = y;
		this.color = color;
		this.get = false;
	}
}

let flag_1 = new flags(2, 29, 1);

let flag_2 = new flags(28, 2, 2);

class player_class {
	constructor(color, flag, posx, posy) {
		this.color = color;

		this.flag = flag;

		this.spawnX = posx;
		this.spawnY = posy;
		this.x = 0;
		this.y = 0;

		this.dirL = false;
		this.dirR = false;
		this.dirU = false;
		this.dirD = false;
		this.boost = false;
		this.boostTime = 0;
		this.boostTimeMinus = 2;
		this.boostTimePlus = 1;
		this.boostTimeMax = 250;
		this.boostTimeMin = 0;

		this.speed = 0.1;
	}

	boostWrite() {
		if (this.boost) {
			if (this.boostTime <= this.boostTimeMin) {
				this.speed = 0.1;
				return;
			}
			this.speed = 0.2;
			this.boostTime -= this.boostTimeMinus;
			if (this.boostTime < this.boostTimeMin) {
				this.boostTime = this.boostTimeMin;
			}
		} else {
			this.speed = 0.1;
			this.boostTime += this.boostTimePlus;
			if (this.boostTime > this.boostTimeMax) {
				this.boostTime = this.boostTimeMax;
			}
		}
	}

	move() {
		if (this.dirD) this.y += this.speed;
		if (this.dirU) this.y -= this.speed;
		if (this.dirL) this.x -= this.speed;
		if (this.dirR) this.x += this.speed;
		this.collision();
		this.moveFlag();
	}

	collision() {
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x > 30) this.x = 30;
		if (this.y > 31) this.y = 31;

		let x = player[1].x;
		let y = player[1].y;
		let ox = player[0].x;
		let oy = player[0].y;

		// prettier-ignore
		if (((x < ox && x + 1 > ox) || (ox < x && ox + 1 > x)) &&
			((y < oy && y + 1 > oy) || (oy < y && oy + 1 > y))) {
			player[0].x = player[0].spawnX;
			player[0].y = player[0].spawnY;
			player[1].x = player[1].spawnX;
			player[1].y = player[1].spawnY;

			flag_1.get = false;
			flag_1.x = flag_1.spawnX;
			flag_1.y = flag_1.spawnY;
			flag_2.get = false;
			flag_2.x = flag_2.spawnX;
			flag_2.y = flag_2.spawnY;
			return;
		}

		y = Math.floor(this.y);
		x = Math.floor(this.x);

		// prettier-ignore
		if (map[y][x] == '#' ||
			map[y][x + 1] == '#' ||
			map[y + 1][x] == '#' ||
			map[y + 1][x + 1] == '#') {
			if (this.dirD) this.y -= this.speed;
			if (this.dirU) this.y += this.speed;
			if (this.dirL) this.x += this.speed;
			if (this.dirR) this.x -= this.speed;
		}

		// prettier-ignore
		if (map[y][x] == 'b' ||
			map[y][x + 1] == 'b' ||
			map[y + 1][x] == 'b' ||
			map[y + 1][x + 1] == 'b') {
			this.x = this.spawnX;
			this.y = this.spawnY;
			this.flag.get = false;
			this.flag.x = this.flag.spawnX;
			this.flag.y = this.flag.spawnY;
		}

		let base = "1";

		if (this.color == "#ff0000") {
			base = "2";
		}

		// prettier-ignore
		if ((map[y][x] == base ||
			map[y][x + 1] == base ||
			map[y + 1][x] == base ||
			map[y + 1][x + 1] == base) &&
			this.flag.get) {
			if (this.color == "#0000ff") alert("Гравець 1 виграв!");
			else alert("Гравець 2 виграв!");
			clearInterval(game);
		}
	}

	getFlag() {
		if (flag.get) {
			flag.get = false;
			return;
		}
		if (Math.round(this.y) == this.flag.y && Math.round(this.x) == this.flag.x) {
			this.flag.get = true;
		}
	}

	moveFlag() {
		if (this.flag.get) {
			this.flag.x = this.x;
			this.flag.y = this.y;
		}
	}
}

let player = [new player_class("#ff0000", flag_1, 28, 2), new player_class("#0000ff", flag_2, 2, 29)];

player[0].x = player[0].spawnX;
player[0].y = player[0].spawnY;
player[0].boostTime = player[0].boostTimeMax;

player[1].x = player[1].spawnX;
player[1].y = player[1].spawnY;
player[1].boostTime = player[1].boostTimeMax;

const map = [
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "2", "2", "2", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "2", "2", "2", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "2", "2", "2", " "],
	[" ", " ", " ", " ", "#", "#", " ", " ", "#", "#", " ", " ", " ", "b", "b", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " "],
	[" ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", "b", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", " ", " ", "b", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", "#", "#", "#", "#", " ", " ", " ", " ", "b", "b", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", "b", "b", " ", " ", " ", " ", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", " ", "b", " ", " ", " ", " ", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", "b", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", " ", "b", "b", "b", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", "b", "b", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", "b", " ", " ", " ", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b", "b", " ", " ", " ", "b", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", "1", "1", "1", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", "1", "1", "1", " ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", "1", "1", "1", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
];

const flag = [
	[" ", " ", " ", " ", " ", " ", " ", "#", "#", "#", " ", " ", "#", "#", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", ".", ".", ".", "#", "#", ".", ".", "#", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", ".", ".", ".", ".", ".", ".", ".", "#", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", ".", ".", ".", ".", ".", ".", ".", "#", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", ".", ".", ".", ".", ".", ".", ".", "#", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", "#", "#", "#", ".", ".", "#", "#", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#", "#", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", " ", "@", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "#", "@", "@", "@", "@", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", "@", "@", "@", "#", "@", "@", "@", "@", "@", "@", "@", " ", " ", " "],
	[" ", "@", "@", "@", "@", "@", "#", "@", "@", "@", "@", "@", "@", "@", "@", "@", " "],
	["@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@"],
	[" ", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", " "],
	[" ", " ", " ", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", "@", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", "@", "@", "@", "@", "@", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", "@", " ", " ", " ", " ", " ", " ", " ", " "],
];

function RendMap() {
	player[0].boostWrite();
	player[1].boostWrite();
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			const tile = map[y][x];
			switch (tile) {
				case "b":
					ctx.fillStyle = "#4da6ff";
					break;
				case "#":
					ctx.fillStyle = "#606070";
					break;
				case "1":
					ctx.fillStyle = "#66ffe3";
					break;
				case "2":
					ctx.fillStyle = "#eb564b";
					break;
				case ".":
					ctx.fillStyle = "#606070";
					break;
				default:
					ctx.fillStyle = "#8fde5d";
			}
			ctx.fillRect(x * px, y * px, px, px);
		}
	}
	RendFlag(flag_1.x, flag_1.y, 1);
	RendFlag(flag_2.x, flag_2.y, 2);
	ctx.fillStyle = player[0].color;
	ctx.fillRect(player[0].x * px, player[0].y * px, px, px);
	ctx.fillStyle = player[1].color;
	ctx.fillRect(player[1].x * px, player[1].y * px, px, px);
}

function RendFlag(posX, posY, color) {
	if (color == 1) {
		color = "#66ffe3";
	} else if (color == 2) {
		color = "#eb564b";
	}
	posX *= px;
	posY *= px;
	posX -= flag[0].length / 4;
	posY -= flag.length / 4;
	let blockSize = px / 10;
	for (let y = 0; y < flag.length; y++) {
		for (let x = 0; x < flag[y].length; x++) {
			switch (flag[y][x]) {
				case "#":
					ctx.fillStyle = "#000";
					break;
				case "@":
					ctx.fillStyle = "#00000070";
					break;
				case ".":
					ctx.fillStyle = color;
					break;
				default:
					ctx.fillStyle = "#0000";
			}
			ctx.fillRect(x * blockSize + posX, y * blockSize + posY, blockSize, blockSize);
		}
	}
}

RendMap();

const game = setInterval(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (player[0].dirD || player[0].dirU || player[0].dirL || player[0].dirR) {
		player[0].move();
	}
	if (player[1].dirD || player[1].dirU || player[1].dirL || player[1].dirR) {
		player[1].move();
	}
	RendMap();
}, fps);

document.addEventListener("keydown", (e) => {
	switch (e.keyCode) {
		// Player 1 controls

		case 32:
			player[0].boost = true;
			break;
		case 40:
			player[0].dirD = true;
			break;
		case 38:
			player[0].dirU = true;
			break;
		case 37:
			player[0].dirL = true;
			break;
		case 39:
			player[0].dirR = true;
			break;
		case 13:
			player[0].getFlag();
			break;

		// Player 2 controls

		case 16:
			player[1].boost = true;
			break;
		case 83:
			player[1].dirD = true;
			break;
		case 87:
			player[1].dirU = true;
			break;
		case 65:
			player[1].dirL = true;
			break;
		case 68:
			player[1].dirR = true;
			break;
		case 67:
			player[1].getFlag();
			break;
	}
});

document.addEventListener("keyup", (e) => {
	switch (e.keyCode) {
		// Player 1 controls

		case 32:
			player[0].boost = false;
			break;
		case 40:
			player[0].dirD = false;
			break;
		case 38:
			player[0].dirU = false;
			break;
		case 37:
			player[0].dirL = false;
			break;
		case 39:
			player[0].dirR = false;
			break;

		// Player 2 controls

		case 16:
			player[1].boost = false;
			break;
		case 83:
			player[1].dirD = false;
			break;
		case 87:
			player[1].dirU = false;
			break;
		case 65:
			player[1].dirL = false;
			break;
		case 68:
			player[1].dirR = false;
			break;
	}
});
