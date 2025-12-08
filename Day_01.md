# Day 01

## Computing without computer

### Sollewit: Wall drawing
![Example Image](content/day01/test.jpg)

Sol LeWitt was a central figure in Conceptual Art, known for creating wall drawings and structures based on written instructions that others could execute. This focus on rules and processes gives me useful inspiration for Computing Without Computers, because his work shows that a complex result can come from simple instructions applied step by step. In my view, LeWitt demonstrates that the idea and the procedure behind an artwork can be as important as the final form, which aligns closely with the logic-based thinking we explore when computing without using a digital device.

### My sketch

For this sketch, I drew inspiration from Sol LeWitt’s conceptual line structures, especially his use of simple rule-based systems that generate visual complexity through repetition. I translated this idea into an interactive p5.js sketch where each mouse click creates a new point on the canvas, and that point is automatically connected with lines to all previously placed points. In this way, the image grows progressively, following a procedural logic similar to LeWitt’s instructions, while giving the user direct control over the composition. The final result is an evolving, unpredictable network of connections in which interaction replaces the traditional artistic gesture and makes the construction process itself visible.

{% raw %}
<iframe src="content/day01/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

### My sketch

This script is based on the idea of creating a structured grid that reacts to the user’s interaction in a simple and controlled way. The canvas is divided into evenly spaced points, each represented by a dot that initially appears in black. The viewer can click on any dot, and that specific point changes color into a randomly generated one, but only once. This introduces a rule-based system where the grid behaves predictably, yet the final visual outcome depends entirely on the user’s choices. The concept highlights how a minimal set of instructions can generate variety within a fixed structure: the grid provides order, while the interaction introduces variation. The result is a composition that emerges step by step through user input, illustrating how controlled systems and simple rules can lead to diverse visual patterns.

{% raw %}
<iframe src="content/day01/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}