import Ant from './Ant'
import config from './config'
import { P5 } from './index'

class AntColony {
    ants = []

    constructor(antCount, posX, posY) {
        this.pos = P5.createVector(posX, posY)
        this.stats = {
            foodBroughtHome: 0,
            antsDied: 0
        }

        for (let i = 0; i < antCount; i++) {
            this.ants.push(new Ant(this))
        }
    }

    update(delta) {
        this.ants.forEach(ant => ant.update(delta))
    }

    draw() {
        P5.scale(config.scale, config.scale)
        P5.noStroke()
        P5.fill('blue')
        P5.rectMode('center')
        P5.circle(
            this.pos.x,
            this.pos.y,
            config.homeHalfSize * 2,
            config.homeHalfSize * 2
        )
        this.ants.forEach(ant => ant.draw())
    }
}

export default AntColony
