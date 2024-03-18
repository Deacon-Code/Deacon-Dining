import os


def concatenate_files(directory, output_file, ignore_substring):
    # Open the output file in write mode
    with open(output_file, "w") as outfile:
        # Iterate over all files in the directory
        for filename in os.listdir(directory):
            if ignore_substring in filename:
                continue  # Skip files containing the ignore substring
            filepath = os.path.join(directory, filename)
            # Check if the path is a file
            if os.path.isfile(filepath):
                # Open each file in read mode and append its content to the output file
                with open(filepath, "r") as infile:
                    for line in infile:
                        outfile.write(f'{filename}, {line}')


# Specify the directory containing the files, the output file name, and the substring to ignore
directory_path = "recorded_days/"  # Change this to the actual directory path
output_file_path = "all_gather.txt"
ignore_substring = "magroom"  # Ignore files containing this substring in their filename

# Call the function to concatenate files
concatenate_files(directory_path, output_file_path, ignore_substring)
