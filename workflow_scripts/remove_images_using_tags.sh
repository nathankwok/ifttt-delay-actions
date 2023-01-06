# Forked from https://gist.github.com/ferferga/93ca1ab3056257d05f6e33af0d6ead49

container="${1}"
tag="${2}"  # Not giving a 2nd arg or giving "" will result in deleting untagged (dangling) images

if [ "${tag}" = "" ]
then
  tag_echo_name=dangling
else
  tag_echo_name="${container}"
fi

echo "Fetching ${container} images with ${tag_echo_name} tag from GHCR"


filter=".[] | select(.metadata.container.tags==[\"${tag}\"]) | .id"
ids_to_delete=$(gh api /user/packages/container/${container}/versions | jq -r "${filter}")

echo "Found image ids:"
echo "${ids_to_delete}"

if [ "${ids_to_delete}" = "" ]
then
	echo "There are no images to remove for this package"
	exit 0
fi

echo -e "\nDeleting ${container} images with ${tag_echo_name} tag..."
while read -r line; do
	id="$line"
	## Workaround for https://github.com/cli/cli/issues/4286 and https://github.com/cli/cli/issues/3937
	echo -n | gh api --method DELETE /user/packages/container/${container}/versions/${id} --input -
	echo Dangling image with ID $id deleted successfully
done <<< $ids_to_delete

echo -e "\nAll the ${container} images with ${tag_echo_name} tag have been removed successfully"
