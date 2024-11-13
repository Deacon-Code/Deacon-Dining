const MenuItemModel = require("./Menu-Item"); // Import your Mongoose model

// Define the function to delete all data points
async function deleteAllDataPoints() {
  try {
    // Log the initial state
    const initialCount = await MenuItemModel.countDocuments();
    console.log(`Initial document count: ${initialCount}`);

    // Use Mongoose to delete all documents from the collection
    const deleteResult = await MenuItemModel.deleteMany({});

    // Log the result of the deletion
    console.log(`Deleted ${deleteResult.deletedCount} documents`);

    return deleteResult.deletedCount; // Return the number of documents deleted
  } catch (error) {
    // Handle any errors
    console.error("Error deleting data:", error.message);

    // Optionally, add more user-friendly error handling or reporting here

    throw error; // Propagate the error to the caller
  }
}

module.exports = { deleteAllDataPoints };
