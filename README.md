# Lazy Chunks

We want to suggest a user options to select
from on user input.

The source list contains 1000's of options.

## Use Case

As user types we want to suggest 5-10 city names
to choose among.

Options are provided by a server and we want to
download a kilobyte or so of data or 
100-200 city names per request.

We want to cache downloaded chunks for re-use.
Yet once cache size exceeds 50k bytes or
5-10k city names we want to drop the earliest
chunks of cache (yet not adjacent to the latest
chunk) to save memory.

In reality city name can be typed in local
language/script or Latin, so we would need
to support both and therefore have both city id,
and city name synonyms relation, whether
it is an official (local) name
or secondary (foreign), and also
what country this city belongs to. 
For brevity we skip here these props.
