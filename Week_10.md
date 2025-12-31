# Week 10

## Pixels

### My sketch

This sketch uses the webcam to capture live video at a very low resolution and redraws it as a grid of large colored rectangles that fill the canvas. Each pixel from the video feed is read individually and scaled up, creating a pixelated, abstract representation of the image, with a horizontal mirror effect to maintain a direct visual relationship with the user. I did not start from a strong conceptual idea for this sketch; instead, I approached it as an experiment to explore what was possible using simple image processing techniques and the tools I already knew, focusing more on testing and observation than on a predefined outcome.

{% raw %}
<iframe src="content/Week10/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

### My sketch

In this version, I added an interactive layer that allows the user to paint directly over the pixelated webcam image. A matrix is used to store color filters for each virtual pixel, initially set to empty. When the user clicks or drags the mouse, the pixel under the cursor is identified and assigned a random semi-transparent color. Once a pixel is colored, it remains fixed and is not overwritten. This creates a permanent overlay that accumulates over time, adding a layer of user interaction on top of the live video feed without altering the underlying pixel structure.

{% raw %}
<iframe src="content/Week10/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}