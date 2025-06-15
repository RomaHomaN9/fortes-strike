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

let player = {
	school: {
		woter: true,
		wall: true,
		flag: true,
	},

	color: "#0000ff",

	spawnX: 2,
	spawnY: 29,
	x: 0,
	y: 0,

	dirL: false,
	dirR: false,
	dirU: false,
	dirD: false,
	boost: false,
	boostTime: 0,
	boostTimeMinus: 2,
	boostTimePlus: 1,
	boostTimeMax: 10000,
	boostTimeMin: 0,

	speed: 0.1,

	down: function () {
		this.dirD = true;
	},
	up: function () {
		this.dirU = true;
	},
	left: function () {
		this.dirL = true;
	},
	right: function () {
		this.dirR = true;
	},

	boostWrite: function () {
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
	},

	move: function () {
		if (this.dirD) this.y += this.speed;
		if (this.dirU) this.y -= this.speed;
		if (this.dirL) this.x -= this.speed;
		if (this.dirR) this.x += this.speed;
		this.collision();
		this.flagMove(flag_2);
	},

	collision: function () {
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x > 30) this.x = 30;
		if (this.y > 31) this.y = 31;
		let y = Math.floor(this.y);
		let x = Math.floor(this.x);

		// prettier-ignore
		if (map[y][x] == '#' ||
			map[y][x + 1] == '#' ||
			map[y + 1][x] == '#' ||
			map[y + 1][x + 1] == '#') {
			if (this.dirD) this.y -= this.speed;
			if (this.dirU) this.y += this.speed;
			if (this.dirL) this.x += this.speed;
			if (this.dirR) this.x -= this.speed;
			if (this.school.wall) {
				alert('Ти вдарився об стіну!!!');
				this.school.wall = false;
				this.reset();
			}
		}
		// prettier-ignore
		if (map[y][x] == 'b' ||
			map[y][x + 1] == 'b' ||
			map[y + 1][x] == 'b' ||
			map[y + 1][x + 1] == 'b') {
			flag_2.get = false;
			flag_2.x = flag_2.spawnX;
			flag_2.y = flag_2.spawnY;
			if (this.school.woter)alert('Ти втопився!!!\n\nТвій прапор повернувся на місце.');
			this.school.woter = false
			this.reset();
			this.x = this.spawnX;
			this.y = this.spawnY;
		}
		// prettier-ignore
		if ((map[y][x] == '1' ||
			map[y][x + 1] == '1' ||
			map[y + 1][x] == '1' ||
			map[y + 1][x + 1] == '1') &&
			flag_2.get) {
				alert("Ти виграв!\nГра закінчена!");
				clearInterval(game);
		}
	},

	getFlag: function (flag) {
		if (flag.get) {
			flag.get = false;
			alert(`Ти викинув прапор!`);
			return;
		}
		let x = Math.round(this.x);
		let y = Math.round(this.y);
		let flagX = Math.round(flag.x);
		let flagY = Math.round(flag.y);
		if (y == flagY && x == flagX) {
			flag.get = true;
			this.flagMove(flag);
			alert(`Ти взяв прапор!}\n\nТепер ти можеш рухатися з прапором.\nДійди до своєї бази, щоб виграти гру!`);
		} else {
			flag.get = false;
			alert(`Ти не можеш взяти прапор!\n\nСпробуй підійти ближче до нього.`);
		}
		console.log(flag.get);
	},

	flagMove: function (flag) {
		if (flag.get) {
			flag.x = this.x;
			flag.y = this.y;
		}
	},

	reset: function () {
		this.dirL = false;
		this.dirR = false;
		this.dirU = false;
		this.dirD = false;
		this.boost = false;
	},
};

player.x = player.spawnX;
player.y = player.spawnY;

player.boostTime = player.boostTimeMax;

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
	player.boostWrite();
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
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x * px, player.y * px, px, px);
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
			ctx.fillRect(x + posX, y + posY, 1, 1);
		}
	}
}

RendMap();

alert(`Вітання до гри!\n\nУправління:\n- W, A, S, D або стрілки для руху\n- Shift для прискорення (зменшується з часом)\n- C для збору прапора\n\nУдачі!`);

const game = setInterval(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (player.dirD || player.dirU || player.dirL || player.dirR) {
		player.move();
	}
	RendMap();
}, fps);

document.addEventListener("keydown", (e) => {
	switch (e.keyCode) {
		case 16:
			player.boost = true;
			break;
		case 40:
		case 83:
			player.down();
			break;
		case 38:
		case 87:
			player.up();
			break;
		case 37:
		case 65:
			player.left();
			break;
		case 39:
		case 68:
			player.right();
			break;
		case 67:
			player.getFlag(flag_2);
			break;
	}
});

document.addEventListener("keyup", (e) => {
	switch (e.keyCode) {
		case 16:
			player.boost = false;
			break;
		case 40:
		case 83:
			player.dirD = false;
			break;
		case 38:
		case 87:
			player.dirU = false;
			break;
		case 37:
		case 65:
			player.dirL = false;
			break;
		case 39:
		case 68:
			player.dirR = false;
			break;
	}
});
