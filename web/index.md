# Two pictures in a grid of flashing lights

Always liked effect you get when two lights are flashing at not quite
the same frequency.  The changing phase relationship is interesting.

<div class="demo-outer" style="float:right;margin-left:1.5rem;margin-top:0rem;">
<div class="demo-container">
<div class="main-LEDs"><canvas class="demo-1x2 lights"></canvas></div>
</div>
</div>

E.g., the right-hand light here is flashing about 5% more quickly than
the left-hand light.  The lights seem to go through periods of
flashing together and of one flashing on when the other flashes off.

On one occasion was behind several cyclists, and all their back lights
were flashing, at slightly different frequencies.  Wondered if you
could arrange a set of lights, each one flashing at a fixed frequency,
such that every now and then they came into phase and made a picture
which flashed on and off.  Played for a while, realised could make
*two* pictures.


## Choosing frequencies and phases

Make a pattern of flashing lights which repeats every minute.  Use *t*
to say how far through the minute we are, so *t* goes from 0 steadily
up to 1 over the course of a minute, then instantly drops back to 0
again.  Want to make one image appear at t=0 and a different image at
t=1/2.  How?

For the pattern to repeat after a minute, every light must do an
integer number of cycles in one minute.  We'll first think about what
happens for lights having different numbers of cycles fitting exactly
into one minute.

Start by thinking about what happens for a light which has 30 on/off
cycles per minute, starting half-way through an "on" state.

<div class="circular-graph" data-freq="30" data-phase="0.0"></div>

This picture represents the light's behaviour on a big circular track.
A pointer sweeps round anticlockwise, completing one revolution per
minute, starting with *t*&nbsp;=&nbsp;0 at the 3-o'clock position.  At
any instant, if it points at a black segment, the light is off; if it
points at an orange segment, the light is on.

We set things up so the light was on at t=0.  It is also on at t=1/2,
because 30 is an even number.

If we wanted this light to be *off* at both t=0 and t=1/2, we could
offset its phase by half a cycle:

<div class="circular-graph" data-freq="30" data-phase="0.5"></div>

Now we'll look at a light which does 29 on/off cycles per minute.

<div class="circular-graph" data-freq="29" data-phase="0.0"></div>

This light is on at t=0 but *off* at t=1/2, because 29 is an odd
number.

If instead we want this light to be *off* at t=0 and *on* at t=1/2, we
can offset its phase by half a cycle:

<div class="circular-graph" data-freq="29" data-phase="0.5"></div>

There are enough degrees of freedom to choose the behaviour of a light
at both *t*&nbsp;=&nbsp;0 and at *t*&nbsp;=&nbsp;½.

* If light should be *off* at time zero and at time ½, choose an even
  frequency and a phase offset of ½;
* If light should be *off* at time zero and *on* at time ½, choose an
  odd frequency and a phase offset of ½;
* If light should be *on* at time zero and *off* at time ½, choose an
  odd frequency and no phase offset;
* If light should be *on* at time zero and at time ½, choose an even
  frequency and no phase offset.

Here, "frequency" means "(integer) number of cycles of that light per
minute".


## Two pictures

Look at lights in a grid.  Want it to show one image at t=0 and
another image at t=1/2.  Choose a 'centre' frequency, and then follow
the above process to choose a frequency and phase for each light in
the grid according to whether it should be lit or unlit at each of
*t*&nbsp;=&nbsp;0 and *t*&nbsp;=&nbsp;½.  Choose different frequencies
for each light, all close to the centre frequency so that the period
when the lights are approximately in (anti-)phase is reasonably long.
Each light's real-world frequency should be somewhere around 1Hz to
look reasonable.  Try to avoid clusters of nearby lights which flash
with similar frequencies.

For many lights, we have to use a longer base time than "one minute"
to get a reasonable result, but the ideas are all the same.  There is
a trade-off because we want the overall pattern to not be *too* long
otherwise you never see the pictures.

The result is something which for a lot of the time looks like random
flashing lights, but now and then coheres into one of two pictures.
For the small 3×3 example below, the two pictures are an "O" and an
"X".  The circle-with-dot in the middle shows where the pattern is in
its global cycle.  When at 3 o'clock (*t*&nbsp;=&nbsp;0), the big
picture looks like the right-hand small picture, flashing on and off.
When at 9 o'clock (*t*&nbsp;=&nbsp;½), the big picture looks like the
left-hand small picture, flashing on and off.

<div class="demo-outer">
<div class="demo-container">
  <div class="main-LEDs">
    <canvas class="demo-3x3 lights"></canvas>
  </div>
  <div class="phasors">
    <canvas class="demo-3x3 lights-1 clickable"></canvas>
    <canvas class="demo-3x3 phasor"></canvas>
    <canvas class="demo-3x3 lights-0 clickable"></canvas>
  </div>
</div>
</div>

You can click/tap on the small pictures to warp time directly to a few
seconds before that picture comes into coherence.

Here's a bigger example, which takes three minutes to cycle:

<div class="demo-outer">
<div class="demo-container">
  <div class="main-LEDs">
    <canvas class="demo-5x5 lights"></canvas>
  </div>
  <div class="phasors">
    <canvas class="demo-5x5 lights-1 clickable"></canvas>
    <canvas class="demo-5x5 phasor"></canvas>
    <canvas class="demo-5x5 lights-0 clickable"></canvas>
  </div>
</div>
</div>


## Hardware realisation

All well and good but want actual real flashing lights.

Bresenham-like algorithm to work in integers throughout.  (Did same
for JS running demos on this page.)  Pico.  C++.  Pixel-doubled (in
software) 8×8 LED matrix.  Wooden frame.

PHOTOS of front and back.
