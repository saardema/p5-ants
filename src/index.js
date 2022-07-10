import P5Instance from '../p5/p5.min.js'
import config from './config'
import map from './map'
import AntColony from './AntColony'

let P5 = new P5Instance(p => {
    p.setup = () => {
        P5.createCanvas(window.innerWidth, window.innerHeight)
        map.setup()
    }

    p.draw = () => {
        P5.background(0)

        // Mouse
        const mx = Math.floor(P5.mouseX / config.scale)
        const my = Math.floor(P5.mouseY / config.scale)
        if (P5.mouseIsPressed) {
            if (P5.mouseButton === 'left') map.updateCell(mx, my, 0, 0, 0.2)
            else map.updateCell(mx, my, 0, 0, -1)
        }

        map.draw()
        colony1.draw()

        map.update()
        colony1.update(P5.deltaTime > 0 ? P5.deltaTime : 16)

        // Stats
        P5.fill('green')
        P5.noStroke()
        P5.textSize(4)
        P5.text('FPS: ' + Math.floor(P5.frameRate()), 2, 4)
        P5.text('Food: ' + colony1.stats.foodBroughtHome, 2, 8)
        P5.text('Died: ' + colony1.stats.antsDied, 2, 12)
        P5.text(`${mx}, ${my}`, 2, 16)
    }
})

const colony1 = new AntColony(config.antCount, config.home.x, config.home.y)

export { P5 }
