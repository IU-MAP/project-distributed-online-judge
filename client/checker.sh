#!/bin/bash

if ! [ -f "data/$2.zip" ]; then
	wget $3/$2.zip -P data
	echo "Downloading"
	echo $3/$2.zip 
fi	

if ! [ -d "judge/$2" ]; then
	echo "Directory not exist"
	mkdir judge/$2
	unzip data/$2.zip -d judge/$2
fi	

cat data/$1 > judge/$2/solution.cpp && g++ -std=c++11 judge/$2/solution.cpp -o judge/$2/solution.out && for ((i=1;;i++))
do
	INPUT=judge/$2/testdata/input/$i.in
	OUTPUT=judge/$2/testdata/output/$i.out
	if [ -f "$INPUT" ] && [ -f "$OUTPUT" ]; then	
		./judge/$2/solution.out < $INPUT > judge/$2/out
		if ! diff -w judge/$2/out $OUTPUT
		then
			exit 1
		fi
	else
		exit 0
	fi
done

