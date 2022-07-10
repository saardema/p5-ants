import map from './map'
import config from './config'
import { P5 } from './index'
import { Vector } from '../p5/p5.min.js'

class Ant {
    static angleIncrement = (Math.PI * 2) / config.sniffResolution

    constructor(colony) {
        this.colony = colony
        this.desiredDirection = new Vector()
        this.spawn()
    }

    spawn() {
        // Spawn
        // Find hottest trail
        // Follow trail
        // Reach food
        //      then stop pheromones
        // Find hottest trail
        // Leave food
        //      then continue pheromones

        this.speed = config.minSpeed
        this.speed = 0
        this.pheromoneCooldownTimer = Math.random() * config.pheromoneInterval
        this.age = 0
        this.lifeSpan =
            config.baseLifespan +
            (Math.random() * config.lifespanVariation - config.lifespanVariation / 2)
        this.pos = this.colony.pos.copy()
        this.dir = new Vector(1, 1)
        this.dir.rotate(Math.random() * Math.PI * 2.0)
        this.focus = 'food'
        this.lookRange = Math.PI * 2
        this.findingDirection = true
        this.sniffDistribution = config.sniffDistribution
        this.lookahead = config.lookahead
    }

    update(delta) {
        this.pheromoneCooldownTimer++
        this.age++

        // Lifecycle
        if (this.age > this.lifeSpan) {
            this.colony.stats.antsDied++
            this.spawn()
        }

        if (this.findingDirection) {
            this.speed = 0
            this.sniffDistribution = 1.4
            this.lookahead = 0
            // this.dir.rotate(0.05)
            if (Math.random() < 0.1) this.findingDirection = false
        } else {
            this.sniffDistribution = config.sniffDistribution
            this.lookahead = config.lookahead
            this.releasePheromone()
        }

        // Arriving at target
        if (this.focus === 'home' && this.isHome()) {
            this.focus = 'food'
            this.findingDirection = true
        } else if (this.focus === 'food') {
            const cell = map.getCell(this.pos.x, this.pos.y)
            if (cell.grub > 0) {
                map.updateCell(this.pos.x, this.pos.y, 0, 0, config.biteSize)
                this.focus = 'home'
                this.findingDirection = true
            }
        }
        this.scatterDirection()
        this.scatterSpeed()

        this.sniff()

        if (this.desiredDirection.mag() > 0) {
            let angle = this.dir.angleBetween(this.desiredDirection)

            if (angle) {
                const rotation = angle * this.desiredDirection.mag() * config.steerFactor
                this.dir.rotate(rotation)
            }
        }

        const vel = this.dir.copy().setMag(16 * this.speed)
        this.pos.add(vel)

        this.constrainOnMap()
    }

    sniff() {
        const senseDirection = this.dir.copy().setMag(config.sniffRange)
        const heading = senseDirection.heading()
        const newDesiredDirection = new Vector()
        const half = config.sniffResolution / 2

        for (let i = 0; i < config.sniffResolution; i++) {
            let lookup = ((i % half) + 1) / half
            let factor = Math.pow(lookup, this.sniffDistribution) * half
            if (i >= half) factor *= -1
            senseDirection.setHeading(heading + factor * Ant.angleIncrement)
            const senseX = this.pos.x + senseDirection.x + this.dir.x * this.lookahead
            const senseY = this.pos.y + senseDirection.y + this.dir.y * this.lookahead
            const cell = map.getCell(senseX, senseY)

            // P5.stroke('white')
            // P5.point(senseX, senseY)
            const toHome = this.colony.pos.copy().sub(this.pos)

            if (this.focus === 'food' && cell.grub > 0) {
                newDesiredDirection.add(senseX - this.pos.x, senseY - this.pos.y)
                newDesiredDirection.normalize()
            } else if (this.focus === 'home' && toHome.mag() < config.sniffRange) {
                newDesiredDirection.add(toHome)
                newDesiredDirection.normalize()
            } else {
                const attraction = new Vector(
                    senseX - this.pos.x,
                    senseY - this.pos.y
                ).setMag(cell[this.focus])

                newDesiredDirection.add(attraction)
            }
        }

        if (newDesiredDirection.mag() > 0) {
            this.desiredDirection = newDesiredDirection
        }
    }

    scatterDirection() {
        if (Math.random() < config.scatterDirectionChance) {
            this.dir.rotate((Math.random() - 0.5) * config.scatterDirectionFactor)
        }
    }

    scatterSpeed() {
        if (Math.random() < config.scatterSpeedChance) {
            this.speed = Math.random() * config.speedVariation + config.minSpeed
        }
    }

    isHome() {
        const x = Math.floor(this.pos.x)
        const y = Math.floor(this.pos.y)
        const homeX = Math.floor(this.colony.pos.x)
        const homeY = Math.floor(this.colony.pos.y)
        return x === homeX && y === homeY
    }

    constrainOnMap() {
        if (this.pos.x >= config.width) {
            this.pos.x = 0
        } else if (this.pos.x < 0) {
            this.pos.x = config.width - 1
        }

        if (this.pos.y >= config.height) {
            this.pos.y = 0
        } else if (this.pos.y < 0) {
            this.pos.y = config.height - 1
        }
    }

    releasePheromone() {
        if (this.pheromoneCooldownTimer > config.pheromoneInterval) {
            this.pheromoneCooldownTimer = 0
            let home = 0
            let food = 0

            if (this.focus === 'home') {
                food = config.pheromoneStrength
            } else {
                home = config.pheromoneStrength
            }

            map.updateCell(this.pos.x, this.pos.y, food, home, 0)
        }
    }

    draw() {
        P5.stroke(0, 0, 255, 60)
        if (this.focus === 'home') P5.stroke(255, 0, 0, 80)

        P5.point(this.pos.x, this.pos.y)
        // P5.line(
        //     this.pos.x,
        //     this.pos.y,
        //     this.pos.x - this.dir.x * 1,
        //     this.pos.y - this.dir.y * 1
        // )
    }
}

export default Ant
