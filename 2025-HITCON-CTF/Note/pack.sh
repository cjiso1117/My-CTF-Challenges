#! /bin/bash


rm -rf src/database/database.sqlite \
    src/storage/app/private/* \
    src/storage/app/public/* \
    src/public/build
rm -f note.tar
tar cvf note.tar dist --dereference

