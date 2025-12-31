# Week 08/09

## Faces and Parametric Generators

This sketch builds on a face-generation system I had already created and applies it directly to the user’s own face using real-time tracking. Instead of generating faces independently, the existing modular face code is preserved and mapped onto the detected face from the webcam. By using facial landmarks (eyes and chin), the system calculates position, scale, and rotation so that the generated face aligns with the user’s head movements. In this way, the sketch combines a previously developed generative structure with face tracking, allowing the synthetic face to follow and adapt to the real one in real time.
{% raw %}

<iframe src="content/Week09/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}