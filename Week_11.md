# Week 11

## Fianl Project

### Project idea

The project is based on the idea of a camera that captures people as they pass by, transforming them into a digital silhouette on the screen. When the user stops and recognizes their own shape, they become aware of being observed and recorded by the system.
This moment of recognition creates a subtle tension between curiosity and discomfort, encouraging reflection on how personal data and visual information are constantly collected through everyday technologies. The computer is not a passive tool: it actively watches, processes, and interprets the user’s presence. Through this interaction, the project highlights the feeling of being monitored and questions how easily we accept surveillance and data capture as part of normal digital life.

### First Iteration
This sketch represents the first step in understanding how body segmentation works. It uses real-time body segmentation to separate the user’s silhouette from the background, processing the webcam feed through a segmentation model that generates a mask. This mask is then mapped pixel by pixel onto the canvas, producing a high-contrast black-and-white image where the body appears as a solid shape and the background is removed. The goal of this sketch is purely exploratory: to observe, test, and understand how the segmentation behaves in real time before building more complex visual or interactive layers on top of it.
{% raw %}
<iframe src="content/Week11/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}