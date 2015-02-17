Time of Day Integer Representation
==================================

The time of day during which an activity can be done can be represented in many ways. In my quest to encode this in a very short way I have adopted a notation which will represent the time as an integer value. The following is how it can be derived.

The time during a day is divided into slots of 4 hours each.

<pre> 0----4----8----12----16----20----24 </pre>

Now if each of the time slot between two time durations can be represented by a binary digit then the representation of an activity which can be done during 8AM to 10PM is going to be the following binary number 001110. Which indicates that the leftmost bit indicates if activity can be done between 12AM to 4AM and the second bit from left indicates if the activity can be done between 4AM to 8AM and so on. This representation narrows down the number of ways in which the durations can be represented and is useful in encoding it in a easy to store format.