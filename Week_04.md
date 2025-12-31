# Week 04

## Clock / Time

This artwork strongly influenced the conceptual direction of my own clock sketch. A Million Times does not use traditional clock hands to show time, but instead relies on repetition, rhythm, and synchronized movement to make the passage of time visible. This approach shifted my attention away from reading time precisely and toward experiencing it visually. What inspired me most is how the installation transforms waiting into an active and contemplative moment: time is not something to check, but something to observe. This idea directly informed my decision to design a clock without hands, where time is communicated through abstract elements and visual change rather than through a conventional mechanical representation.

{% raw %}
<video width="100%" height="450" loop muted autoplay>
  <source src="https://github.com/pis00/gencg_h2501/raw/journal/content/Week04/A_million_time.mp4" type="video/mp4">
</video>
{% endraw %}

### My exemple

This sketch explores the idea of showing time without using traditional clock hands, focusing on a more abstract and visual approach. The clock is composed of 60 dots arranged in a circle, each representing a unit of time. The current second is highlighted in red, the current minute in green, and the current hour in blue, allowing all three time values to be visible simultaneously. Larger dots appear every five units to give the structure of a traditional clock while keeping the form minimal and graphical. Instead of moving hands, the artwork relies on color, position, and repetition to communicate the passage of time, transforming a familiar object into a generative and visually driven system.

{% raw %}
<iframe src="content/Week04/01/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}

### My exemple
The idea for this digital clock comes from the mechanical flip clock, in particular from the moment when the time changes and the numbers physically flip to the next value. Rather than focusing on the object itself, I was interested in the visual and temporal effect of this transition: the brief interruption where the old time disappears and the new one appears. This flipping action makes the passage of time feel tangible and rhythmic, emphasizing change rather than static display. I wanted to translate this sensation into a digital form, keeping the feeling of anticipation and movement that characterizes flip clocks.


![Example Image](/content/Week04/Clock.jpeg)


To create this effect in my sketch, I built a grid-based digital clock where each cell behaves like a small flip element. The current time is displayed using pixel-style digits, and when the time updates, the cells animate instead of changing instantly. A flip animation compresses each cell vertically before revealing its new state, echoing the physical movement of a mechanical flip clock. In addition to the time-based transitions, an interactive animation is triggered when the user interacts with the clock, causing a visual ripple that propagates across the grid. This interaction reinforces the idea of time as something dynamic and responsive, translating the mechanical behavior of a flip clock into a digital, generative system.

{% raw %}
<iframe src="content/Week04/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}
