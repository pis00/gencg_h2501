# Week 12

## Fianl Project

### Second Iteration

Starting from the initial sketch, which was focused on understanding how body segmentation works and how to extract a clean silhouette from the webcam feed, I gradually built on that foundation by adding a generative visual layer. Once the segmentation mask was reliable, I used it as a condition to control where visual elements could appear on the screen. Instead of simply displaying the silhouette, I introduced a grid-based system inspired by the Matrix effect, where streams of characters fall vertically. Each character is only drawn if it falls inside the segmented body area, using the alpha values of the segmentation mask as a filter. In this way, the segmentation is no longer the final output but becomes an invisible control structure that shapes and constrains the generative behavior, turning the body into an active mask that reveals the animation.

{% raw %}
<iframe src="content/Week12/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

### Third Iteration

Compared to the previous version, this sketch increases the density of the grid by reducing the cell size, resulting in a finer and more continuous flow of characters. The stream lengths and reset behavior are adjusted to better match the camera area, creating a smoother and more consistent vertical motion. Visually, the character color is changed to black, simplifying the overall appearance while keeping the same segmentation logic.

{% raw %}
<iframe src="content/Week12/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}