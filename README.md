# FeatherWeight


## Disclaimer
This is the concept of BIRD3's persistent cache.

FeatherWeight is a data store provider that dumps its contents to the harddrive upon exiting and will re-load that very data upon relaunch, enabling for it to be persistent across runs, allowing it to react fast and provide reliable data retrievability and avoid to rebuild the cache.

Redis is currently used as an IPC/RPC, but due to [hprose](https://github.com/hprose), this can easily be dropped and changed/reimplemented. PHP can communicate with FeatherWeight through hprose, as well as other languages.

This will NOT replace the depdendency on MySQL. This is soley an object cache.

## Dependencies
- hprose

## Development
The currently uploaded code is a `0.0.0` release - aka. a preview. This is all likely going to be changed. This is also ment to showcase some use-cases of hprose. Development will continue as I have time.
