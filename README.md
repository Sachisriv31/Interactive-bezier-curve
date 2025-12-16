Interactive Bézier Curve with Rope-Like Motion

Overview
This project demonstrates an interactive cubic Bézier curve that behaves like a flexible rope stretched between two fixed endpoints. 
The curve responds in real time to user interaction and shows how Bézier geometry can be combined with simple physics to simulate natural motion.
The main goal of this assignment was to implement the mathematics and motion logic manually without relying on any built-in graphics or physics libraries.

Bézier Curve Implementation
The curve is generated using the standard cubic Bézier equation with four control points:
P₀ and P₃ are fixed endpoints
P₁ and P₂ are movable control points
The curve position is computed by sampling the parameter t from 0 to 1 at small intervals and calculating each point using the cubic Bézier formula. This produces a smooth curve drawn on the canvas.

Tangent Computation
To visualize the direction of the curve, tangents are calculated using the analytical derivative of the cubic Bézier equation.
These tangent vectors are normalized and drawn at regular intervals along the curve to show how the curve’s direction changes.

Motion and Physics Model
To make the curve behave like a rope, a simple spring-damping model is applied to the middle control points (P₁ and P₂).
Each control point moves toward a target position using:
A spring force proportional to displacement
A damping factor to prevent oscillation
This results in smooth and natural motion without using any external physics engine.

Interaction
The endpoints of the rope remain fixed.
Mouse movement affects the target positions of the middle control points, causing the rope to bend and react dynamically in real time.

Rendering and Performance
The visualization is rendered using the HTML5 Canvas API and updated using requestAnimationFrame, ensuring smooth animation at approximately 60 frames per second.
Design Constraints Followed
No prebuilt Bézier or physics libraries were used
All mathematics and motion logic were implemented manually
Code is organized into clear sections for math, physics, rendering, and input
The simulation is fully interactive and real time

Conclusion
This project demonstrates how mathematical curve representation and basic physics concepts can be combined to create an interactive and visually intuitive simulation. 
It provides a clear understanding of cubic Bézier curves, tangents, and motion smo
