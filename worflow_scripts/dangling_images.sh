# Forked from https://gist.github.com/ferferga/93ca1ab3056257d05f6e33af0d6ead49

echo "Fetching dangling images from GHCR..."
container=$1
ids_to_delete=$(gh api /user/packages/container/${container}/versions | jq -r '.[] | select(.metadata.container.tags==[]) | .id')

echo "Found dangling image ids:"
echo "${ids_to_delete}"

if [ "${ids_to_delete}" = "" ]
then
	echo "There are no dangling images to remove for this package"
	exit 0
fi

echo -e "\nDeleting dangling images..."
while read -r line; do
	id="$line"
	## Workaround for https://github.com/cli/cli/issues/4286 and https://github.com/cli/cli/issues/3937
	echo -n | gh api --method DELETE /user/packages/container/${container}/versions/${id} --input -
	echo Dangling image with ID $id deleted successfully
done <<< $ids_to_delete

echo -e "\nAll the dangling images have been removed successfully"
