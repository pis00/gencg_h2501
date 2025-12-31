# Week 13

## Fianl Project

### Fourth Iteration

Compared to the previous version, this sketch restructures the Matrix effect from a stream-based system to a grid-based one. Instead of generating independent vertical streams with variable lengths and speeds, each column now has a continuous vertical offset and a fixed character per cell, resulting in a more uniform and controlled flow. The grid resolution is increased by reducing the cell size, making the visual output denser. Additionally, character changes are no longer fully random every frame: each cell keeps its character and updates it only occasionally, which stabilizes the image and reduces visual noise. The segmentation logic remains the same, but its application becomes more precise and consistent due to the grid-based structure.

{% raw %}
<iframe src="content/Week13/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}