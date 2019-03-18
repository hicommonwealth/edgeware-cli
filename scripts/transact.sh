key=$1
acct=$2
network=$3

for i in {1..10}
do
	yarn api -r "${network}" -s "${key}" balances transfer "${acct}" 1
done
