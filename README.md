# FeatherWeight

This is the concept of BIRD3's persistent cache.

FeatherWeight is a data store provider that dumps its contents to the harddrive upon exiting and will re-load that very data upon relaunch, enabling for it to be persistent across runs, allowing it to react fast and provide realiable data retrivability and avoid to rebuild the cache.

Redis is currently used as an IPC/RPC, but due to [hprose](https://github.com/hprose), this can easily be dropped and changed. PHP can communicate with FeatherWeight through hprose.

This will NOT replace the depdendency on MySQL. This soley an object cache.

## Dependencies
- hprose

## Development
I am working on the concept. This is a reminder to myself to continue this project. It will be pretty neat and useful too. It also is the first project to directly depend on hprose to provide it's functionality.
