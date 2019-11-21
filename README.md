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

### Cache structure

Here we use fictional city names.

For the following example we assume
that hint list size is 5 city names,
server response offers 5 city names (chunk size),
and max number of chunks to cache is 5. 

At some point our cache may look as follows:

```
{
  "c": {
    "ca": {
      "cab": {
        "caba": {
          "_": ["Caba"], // city
          "cabad": {
            "_": [
              "Cabad",
              "Cabad Al",
            ] 
          },
          "cabag": {
            "_": [
              "Cabaga",
              "Cabagor",
              "Cabagusto"
            ]
          },
          "cabam": {
            "_": ["Cabamer"]
          }
        },
        "cabe": {
          "_": [
            "Cabe",
            "Cabe Olia",
            "Cabez"
          ]
        },
      },
      "cac": {
        "_": ["Caccoa"]
      },
    },
    "co": {
      "_": ["Colesia"]
    }
  },
  "d": {
    "da": {
      "_": [
        "Daas",
        "Dae"
      ]
    },
    "de": {
      "_": ["Deet"]
    },
    "di": {
      "_": ["Di Aro"]
    }
  }
}
```

Here is the possible scenario of the cache
above formation.

**Action 1**
1. User input: `d`
1. Cache service: Number of entries = 0
   as there is no key `d` in hash map;
   need data from server 
1. Request: `d`
1. Response: `{"d":{"da":{"_":["Daas","Dae"]},"de":{"_":["Deet"]},"di":{"_":["Di Aro"]}}}` 
1. Input hint: `["Daas","Dae","Deet","Di Aro"]`
1. Cache stack: `["d>da", "d>de", "d>di"]`
1. Cache final entries: 4
1. Explanation: 

**Action 2**
1. User input: `de`
1. Cache service: Number of entries = 1
   as there is single value under key `de` in hash map;
   have some data; need update data from server
1. --- Input hint: `["Deet"]`
1. -- Request: `de`
1. --- Response: `{"d":"de":{"_":["Deet"]}}` 
1. --- Input hint: `["Deet"]` (no change)
1. Cache stack: `["d>da", "d>di", "d>de"]`
1. Cache final entries: 4
1. Explanation: 

**Action 3**
1. User input: `c`
_TBD_
1. Cache service: Number of entries = 1
   as there is single value under key `de` in hash map;
   have some data; need update data from server
1. --- Input hint: `["Deet"]`
1. -- Request: `de`
1. --- Response: `{"d":"de":{"_":["Deet"]}}` 
1. --- Input hint: `["Deet"]` (no change)
1. Cache stack: `["da", "di", "de"]`
1. Cache final entries: 4
1. Explanation: 
