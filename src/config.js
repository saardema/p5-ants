const scale = 4
const width = Math.floor(window.innerWidth / scale)
const height = Math.floor(window.innerHeight / scale)

export default {
    scale,
    height,
    width,
    antCount: 1000,
    home: {
        x: 30 * scale,
        y: 20 * scale
    },
    homeHalfSize: 4,
    food: {
        x: 80 * scale,
        y: 40 * scale
    },
    foodHalfSize: 5,
    baseLifespan: 3200,
    lifespanVariation: 3200,
    lookahead: 12,
    sniffRange: 10,
    sniffResolution: 10,
    sniffDistribution: 5,
    biteSize: 0.02,
    minSpeed: 0.01,
    speedVariation: 0.03,
    scatterDirectionChance: 0.2,
    scatterDirectionFactor: 0.5,
    scatterSpeedChance: 0.01,
    steerFactor: 0.8,
    pheromoneInterval: 3,
    pheromoneStrength: 0.03,
    pheromonePersistence: 0.995,
    pheromonePersistenceInterval: 5
}
