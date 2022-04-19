class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
        this.level = 1
        this.pause = false
        this.coinsTotal = 0
    }

    preload() {

        this.load.image('pagman', 'images/pagman.png')
        this.load.spritesheet('coin', 'images/coin.png', {
            frameWidth: 20,
            frameHeight: 20
        })
        this.load.image('thief', 'images/widehardo.png')
        this.load.image('home', 'images/home.png')

        this.load.image('grassWall', 'images/overworldWall.png')
        this.load.image('grassHole', 'images/overworldHole.png')
        this.load.image('grassBackground', 'images/overworldBackground.png')

        this.load.image('homeBackground', 'images/hauseBackground.png')
        this.load.image('homeHole', 'images/hauseHole.png')

        this.load.image('dungeonBackground', 'images/dungeonBackground.png')
        this.load.image('dungeonHole', 'images/dungeonHole.png')
        this.load.image('dungeonWall', 'images/dungeonWall.png')
    }

    create() {

        switch (this.level) {
            case 1: {
                this.add.image(505, 375, 'grassBackground')
                break
            }

            case 2: {
                this.add.image(511, 270, 'homeBackground')
                break
            }

            case 3: {
                this.add.image(511, 270, 'dungeonBackground')
                break;
            }

            default: {
                console.error("invalid level number" + this.level)
            }
        }

        this.player = this.physics.add.sprite(150, 150, 'pagman')
        this.player.body.collideWorldBounds = true

        this.point = this.physics.add.sprite(200, 200, 'coin')
        this.point.body.immovable = true
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', {
                start: 0,
                end: 5
            }),
            frameRate: 15,
            repeat: -1
        })
        this.point.anims.play('rotate')
        this.home = this.physics.add.sprite(50, 70, 'home')
        this.home.body.collideWorldBounds = true
        this.home.body.immovable = true

        this.thief = this.physics.add.sprite(Math.round(Math.random() * (width - 300) + 300),
            Math.round(Math.random() * (height - 300) + 300), 'thief')
        this.thief.body.collideWorldBounds = true


        this.wall = this.physics.add.staticGroup()
        for (let i = 0; i < this.level * 5; i++) {

            let brick

            let x
            let y

            do {
                x = Math.round(Math.random() * (width - 80) + 40)
                y = Math.round(Math.random() * (height - 80) + 40)
            } while (x < 200 && y < 200)

            switch (this.level) {

                case 1:
                case 2: {
                    brick = this.wall.create(x, y, 'grassWall')
                    break
                }

                case 3: {
                    brick = this.wall.create(x, y, 'dungeonWall')
                    break;
                }

                default: {
                    console.error("invalid level number" + this.level)
                }
            }

            brick.body.collideWorldBounds = true;
            brick.body.immovable = true
        }

        this.holes = this.physics.add.staticGroup()
        for (let i = 0; i < this.level * 1; i++) {

            let hole

            let x
            let y

            do {
                x = Math.round(Math.random() * (width - 80) + 40)
                y = Math.round(Math.random() * (height - 80) + 40)
            } while (x < 200 && y < 200)

            switch (this.level) {

                case 1: {
                    hole = this.holes.create(x, y, 'grassHole')
                    break
                }

                case 2: {
                    hole = this.holes.create(x, y, 'homeHole')
                    break
                }

                case 3: {
                    hole = this.holes.create(x, y, 'dungeonHole')
                    break
                }

                default: {
                    console.error("invalid level number " + this.level)
                }
            }

            hole.body.collideWorldBounds = true;
            hole.body.immovable = true
        }

        this.coinsInBag = 0
        this.coinsInHome = 0

        this.cursors = this.input.keyboard.createCursorKeys()

        this.coinsInBagText = this.add.text(width - 150, 5, "Coins in bag: " + this.coinsInBag, {
            font: "20px Arial",
            fill: "#000000"
        })
        this.coinsInHomeText = this.add.text(5, 5, "Coins in home: " + this.coinsInHome, {
            font: "20px Arial",
            fill: "#000000"
        })
        this.add.text(width / 2 - 50, 5, "Level: " + this.level, {
            font: "30px Arial",
            fill: "#000000"
        })
        this.infoText = this.add.text(width / 2 - 200, height / 2 - 100, "", {
            font: "50px Arial",
            fill: "#000000"
        })
    }

    update() {

        this.player.body.velocity.x = 0
        this.player.body.velocity.y = 0

        this.thief.body.velocity.x = 0
        this.thief.body.velocity.y = 0

        if (!this.pause) {
            
            if (this.thief.x > this.player.x) {

                this.thief.body.velocity.x = -100

            } else if (this.thief.x < this.player.x) {

                this.thief.body.velocity.x = 100
            }

            if (this.thief.y > this.player.y) {

                this.thief.body.velocity.y = -100
            } else if (this.thief.y < this.player.y) {

                this.thief.body.velocity.y = 100
            }


            if (this.cursors.left.isDown) {

                this.player.body.velocity.x = -260 + this.coinsInBag * 20
                this.player.angle = 180;
            }
            if (this.cursors.right.isDown) {

                this.player.body.velocity.x = 260 - this.coinsInBag * 20
                this.player.angle = 0;
            }
            if (this.cursors.up.isDown) {

                this.player.body.velocity.y = -260 + this.coinsInBag * 20
                this.player.angle = 270;
            }
            if (this.cursors.down.isDown) {

                this.player.body.velocity.y = 260 - this.coinsInBag * 20
                this.player.angle = 90;
            }
        }

        this.physics.collide(this.player, this.point, () => {

            this.coinsInBag += 1
            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag

            this.point.x = Math.round(Math.random() * (width - 100) + 60)
            this.point.y = Math.round(Math.random() * (height - 100) + 60)
        })

        this.physics.collide(this.player, this.wall)

        this.physics.collide(this.player, this.home, () => {

            this.coinsInHome += this.coinsInBag
            this.coinsTotal += this.coinsInBag
            this.coinsInBag = 0
            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag
            this.coinsInHomeText.text = "Coins in home: " + this.coinsInHome

            if (this.coinsInHome >= this.level * 10) {

                this.pause = true

                if (this.level == 3) {

                    this.infoText.text = "   Congratulations\n     Total coins: " + this.coinsTotal + "\n      You've won"
                    this.coinsInBagText.text = ""
                    this.coinsInHomeText.text = ""

                    this.time.addEvent({
                        delay: 2000, callback: () => {
                            this.level = 1
                            this.coinsTotal = 0

                            this.pause = false
                            this.scene.restart()
                        }
                    })
                }
                else {
                    this.infoText.text = "   Level passed\nCoins collected: " + this.coinsInHome + "\n  Loading level: " + (this.level + 1)
                    this.coinsInBagText.text = ""
                    this.coinsInHomeText.text = ""

                    this.time.addEvent({
                        delay: 2000, callback: () => {
                            this.level += 1

                            this.pause = false
                            this.scene.restart()
                        }
                    })
                }
            }
        })

        this.physics.collide(this.player, this.thief, () => {

            if (this.coinsInBag !== 0) {

                this.coinsInBag = 0
                this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag

                this.infoText.text = "         THIEF!\nYou lost your coins"

                this.time.addEvent({
                    delay: 2000, callback: () => {

                        this.infoText.text = ""
                    }
                })
            }
        })

        this.physics.collide(this.player, this.holes, () => {

            this.pause = true

            this.infoText.text = "    GAME OVER \n    Your score: " + this.coinsTotal + "\n  Reloading game"
            this.coinsInBagText.text = ""
            this.coinsInHomeText.text = ""

            this.time.addEvent({
                delay: 5000, callback: () => {

                    this.level = 1
                    this.pause = false
                    this.coinsTotal = 0
                    this.scene.restart()
                }
            })
        })

        this.physics.collide(this.thief, this.wall)
        this.physics.collide(this.thief, this.holes)
    }
}
