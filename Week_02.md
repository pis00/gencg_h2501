# Week 02

## Grids and patterns

### Escher tessellations

Escher’s tessellations inspired me through the way he transforms a single recognizable shape into a seamless, interconnected pattern, where each element becomes part of a larger visual system. His work shows how structure can emerge from carefully constructed relationships, even when the overall composition appears intricate or dynamic. This approach influenced my thinking by showing me how users could be encouraged to either align shapes so they fit together or distort them in ways that reveal new patterns.

![Example Image](content/Week02/Grid.jpg)

### My sketch

This sketch creates a grid of triangular shapes that continuously transform as the user moves the mouse. The horizontal mouse position controls how many cells the grid contains, while the vertical position determines how much the shapes “snap” into alignment. Each triangle begins in a slightly distorted and randomly displaced form generated through noise functions, and as the user moves the mouse upward, the shapes gradually shift, rotate, and morph until they fit together cleanly in an ordered pattern. The concept behind the sketch is to let the user experience how individual forms can transition from randomness to perfect alignment, echoing the logic of tessellations. By interacting with the grid, the user actively controls the moment when the shapes coincide, revealing how structured patterns can emerge from irregular elements.

{% raw %}
<iframe src="content/Week02/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

### My sketch

This sketch uses a custom WebGL shader to draw an oblique grid made of evenly spaced black lines. The key idea is that the grid is not static: the mouse position acts as a “distortion lens” that bends, bulges, and slightly twists the lines around the cursor. The shader calculates the distance between each pixel and the mouse, and within a defined radius it applies controlled transformations such as bulging and swirling. Outside this area, the grid returns to its regular geometric structure. The concept behind the sketch is to let the user visually deform a rigid, ordered system by interacting with it, revealing how a precise grid can behave like a flexible material when influenced by simple rules. The user becomes the force that reshapes the pattern, emphasizing the contrast between structured geometry and dynamic distortion.

{% raw %}
<iframe src="content/Week02/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}