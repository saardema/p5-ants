import Cell from './Cell'
import config from './config'
import { P5 } from './index'

let image
let tick = 0

const map = {
    data: []
}

function setPixel(x, y, food, home, grub) {
    x = Math.floor(x)
    y = Math.floor(y)
    const index = x + y * config.width
    image.pixels[index * 4 + 0] = food * 255 + grub * 255
    image.pixels[index * 4 + 2] = home * 255
    image.pixels[index * 4 + 3] = 255
}

function buildImage() {
    image.loadPixels()

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const cell = map.getCell(x, y)
            setPixel(x, y, cell.food, cell.home, cell.grub)
        }
    }

    image.updatePixels()
}

function buildMap() {
    const size = config.width * config.height

    for (let i = 0; i < size; i++) {
        let grub = 0
        let food = 0
        const x = i % config.width
        const y = Math.floor(i / config.width)

        // if (y > 30 && y < 190 && x === config.food.x) food = 0.3
        // if (x > 120 && x < config.food.x && y === config.food.y) food = 0.3

        // Grub drop
        if (
            x >= config.food.x - config.foodHalfSize &&
            x < config.food.x + config.foodHalfSize
        ) {
            if (
                y >= config.food.y - config.foodHalfSize &&
                y < config.food.y + config.foodHalfSize
            ) {
                grub = 1
            }
        }

        map.data[i] = new Cell(food, 0, grub)
    }
}

map.updateCell = (x, y, foodChange, homeChange, grubChange) => {
    const cell = map.getCell(x, y)

    cell.food = Math.max(Math.min(cell.food + foodChange, 1), 0)
    cell.home = Math.max(Math.min(cell.home + homeChange, 1), 0)
    cell.grub = Math.max(Math.min(cell.grub + grubChange, 1), 0)

    setPixel(x, y, cell.food, cell.home, cell.grub)
}

map.getCell = (x, y) => {
    x = (Math.floor(x) + config.width) % config.width
    y = (Math.floor(y) + config.height) % config.height
    return map.data[x + y * config.width]
}

map.setup = () => {
    buildMap()
    image = P5.createImage(config.width, config.height)
    buildImage()
}

map.update = () => {
    tick += 1
    if (tick % config.pheromonePersistenceInterval === 0) {
        map.data.forEach((cell, i) => {
            const x = i % config.width
            const y = Math.floor(i / config.width)
            cell.food = cell.food * config.pheromonePersistence
            cell.home = cell.home * config.pheromonePersistence
            setPixel(x, y, cell.food, cell.home, cell.grub)
        })
    }
}

map.draw = p => {
    image.updatePixels()
    P5.image(image, 0, 0, image.width * config.scale, image.height * config.scale)
}

export default map
