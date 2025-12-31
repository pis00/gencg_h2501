# Week 04

## Clock / Time

In September 2021 Humans since 1982 launched A million Times (San José), a new site-specific commission for Mineta San José Airport in California, USA. Installed in the pre-security Arrivals Halls of Terminal B, the piece is a permanent public artwork as part of the Airport’s Art + Technology Public Art Program. 

Humans since 1982 were selected by a panel of  Bay Area artists, arts administrators, and airport stakeholders to bring a unique vision of time to the airport.  Bastian Bischoff - Co-founder of Humans since 1982 reflects, “The passage of time feels particularly relevant in the context of the airport. By placing this work in Mineta San José Airport, we intend to turn waiting into a reflective and meditative opportunity, creating a space where people choose and enjoy the experience of waiting.”  

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

<video width="100%" height="450" loop muted autoplay>
  <source src="https://github.com/pis00/gencg_h2501/raw/journal/content/Week04/Clock.jpeg" type="video/mp4">
</video>
{% endraw %}

To create this effect in my sketch, I built a grid-based digital clock where each cell behaves like a small flip element. The current time is displayed using pixel-style digits, and when the time updates, the cells animate instead of changing instantly. A flip animation compresses each cell vertically before revealing its new state, echoing the physical movement of a mechanical flip clock. In addition to the time-based transitions, an interactive animation is triggered when the user interacts with the clock, causing a visual ripple that propagates across the grid. This interaction reinforces the idea of time as something dynamic and responsive, translating the mechanical behavior of a flip clock into a digital, generative system.

{% raw %}
<iframe src="content/Week04/02/embed.html" width="100%" height="450" frameborder="no"></iframe>
{% endraw %}
