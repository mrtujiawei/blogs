```javascript
class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(vector) {
    const x = this.x + vector.x
    const y = this.y + vector.y
    return new Vector2(x, y)
  }

  subtract(vector) {
    const x = this.x - vector.x
    const y = this.y - vector.y
    return new Vector2(x, y)
  }

  multiply(scalar) {
    const x = this.x * scalar
    const y = this.y * scalar
    return new Vector2(x, y)
  }

  rotate(angleInDegrees) {
    const radians = (angleInDegrees * Math.PI) / 180
    const ca = Math.cos(radians)
    const sa = Math.sin(radians)
    const x = ca * this.x - sa * this.y
    const y = sa * this.x + ca * this.y
    return new Vector2(x, y)
  }
}

function iterate(initialVectors, steps) {
  let vectors = initialVectors
  for (let i = 0; i < steps; i++) {
    vectors = iterationStep(vectors)
  }

  return vectors
}

function iterationStep(vectors) {
  const newVectors = []
  for (let i = 0; i < vectors.length - 1; i++) {
    const startVector = vectors[i]
    const endVector = vectors[i + 1]
    newVectors.push(startVector)
    const differenceVector = endVector.subtract(startVector).multiply(1 / 3)
    newVectors.push(startVector.add(differenceVector))
    newVectors.push(
      startVector.add(differenceVector).add(differenceVector.rotate(60))
    )
    newVectors.push(startVector.add(differenceVector.multiply(2)))
  }

  newVectors.push(vectors[vectors.length - 1])
  return newVectors
}

function drawToCanvas(vectors, canvasWidth, canvasHeight) {
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.moveTo(vectors[0].x, vectors[0].y)
  for (let i = 1; i < vectors.length; i++) {
    ctx.lineTo(vectors[i].x, vectors[i].y)
  }
  ctx.stroke()

  return canvas
}

function getKochSnowflake(canvasWidth = 600, steps = 5) {
  if (canvasWidth <= 0) {
    throw new Error('canvasWidth should be greater than zero')
  }

  const offsetX = canvasWidth / 10.0
  const offsetY = canvasWidth / 3.7
  const vector1 = new Vector2(offsetX, offsetY)
  const vector2 = new Vector2(
    canvasWidth / 2,
    Math.sin(Math.PI / 3) * canvasWidth * 0.8 + offsetY
  )
  const vector3 = new Vector2(canvasWidth - offsetX, offsetY)
  const initialVectors = []
  initialVectors.push(vector1)
  initialVectors.push(vector2)
  initialVectors.push(vector3)
  initialVectors.push(vector1)
  const vectors = iterate(initialVectors, steps)
  return drawToCanvas(vectors, canvasWidth, canvasWidth)
}

if (typeof window !== 'undefined') {
  const canvas = getKochSnowflake()
  document.body.append(canvas)
}
```
