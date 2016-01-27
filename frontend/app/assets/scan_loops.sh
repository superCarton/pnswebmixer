#!/bin/bash

filename="loops.json"
output="["

for file in loops/*.mp3
do
	output="$output\"assets/"
	output="$output$file"
	output="$output\","
done

output="${output::-1}"
output="$output]"

echo $output > $filename