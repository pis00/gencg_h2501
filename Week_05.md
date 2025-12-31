# Week 05

## Drawing Machines

### My sketch

This sketch functions as a drawing machine that executes an autonomous process once activated. After a single user interaction, the system generates a black spiral that expands from the center outward, progressively covering the entire canvas. When the spiral reaches its maximum extent, the machine reverses the process and redraws the same path in white, gradually removing the previously drawn lines. Once the process is complete, the system returns to its initial idle state, waiting to be triggered again. The sketch emphasizes rule-based generation, repetition, and automated execution without further user control.

{% raw %}
<iframe src="content/Week05/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

### My sketch
The sketch is built by layering simple movements to let the computer generate a continuous drawing on its own. A main point moves along a four-sided path near the edges of the canvas, while an invisible circle orbits around this moving center. A smaller point then rotates along the circumference of that circle, creating small variations in position at every frame. By combining these motions and connecting each position to the previous one, the computer draws a single uninterrupted line. The creative process was focused on defining a clear path and introducing subtle changes through rotation and speed, allowing the drawing to evolve gradually through small deviations rather than through direct manual control.
{% raw %}
<iframe src="content/Week05/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

This sketch is used to visualize the trajectory that generates the drawing in the sketch above. It does not produce a drawing itself, but exposes all the moving elements involved in the motion system, making the path easier to read.

{% raw %}
<iframe src="content/Week05/03/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}