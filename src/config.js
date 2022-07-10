const scale = 4
const width = Math.floor(window.innerWidth / scale)
const height = Math.floor(window.innerHeight / scale)

export default {
    scale,
    height,
    width,
    antCount: 1000,
    home: {
        x: (Math.random() * window.innerWidth) / scale,
        y: (Math.random() * window.innerHeight) / scale
    },
    homeHalfSize: 4,
    food: {
        x: (Math.random() * window.innerWidth) / scale,
        y: (Math.random() * window.innerHeight) / scale
    },
    foodHalfSize: 5,
    baseLifespan: 3200,
    lifespanVariation: 3200,
    lookahead: 5,
    sniffRange: 10,
    sniffResolution: 10,
    sniffDistribution: 2,
    biteSize: 1,
    findingDirectionChance: 0.5,
    minSpeed: 0.01,
    speedVariation: 0.03,
    scatterDirectionChance: 0.2,
    scatterDirectionFactor: 0.7,
    scatterSpeedChance: 0.01,
    steerFactor: 0.3,
    pheromoneInterval: 2,
    pheromoneStrength: 0.054,
    pheromonePersistence: 0.97,
    pheromonePersistenceInterval: 5
}
