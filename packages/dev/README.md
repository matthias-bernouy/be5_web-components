# Structure

## src/data
-> Fetch 
-> RW on file system
-> Resources

The folder is the only available to do these actions.

## src/core
-> Only pure functions

## src/entry/service
-> Can use all the src/core, src/data and src/lib functions

## src/entry/bin
-> For the CLI

## src/lib
-> For connectors with external libraries