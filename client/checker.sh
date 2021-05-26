#!/bin/bash

if ! [ -f "data/$2.zip" ]; then
	wget $3/$2.zip -P data
	echo "Downloading"
	echo $3/$2.zip 
fi	

if ! [ -d "judge/$2" ]; then
	echo "Test directory missing"
	mkdir judge/$2
fi	

if ! [ -d "judge/$2/testdata" ]; then
	echo "Testdata directory missing"
	unzip data/$2.zip -d judge/$2
fi	
cat data/$1 > judge/$2/solution.cpp
g++ -std=c++11 judge/$2/solution.cpp -o judge/$2/solution.out
max_runtime = 0
for ((i=1;;i++))
do
	INPUT=judge/$2/testdata/input/$i.in
	OUTPUT=judge/$2/testdata/output/$i.out
	if [ -f "$INPUT" ] && [ -f "$OUTPUT" ]; then	
		start=`date +%s.%N`
		./judge/$2/solution.out < $INPUT > judge/$2/out
		end=`date +%s.%N`
		runtime=$( echo "$end - $start" | bc -l )
		if [[ "$runtime" > "$max_runtime" ]]; then
			max_runtime="$runtime"
		fi
		if ! diff -w judge/$2/out $OUTPUT
		then
			exit 1
		fi
	else
		echo $max_runtime
		exit 0
	fi
done
