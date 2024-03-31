const MenuItemModel = require('./Menu-Item'); // Import your Mongoose model

// Define the function to delete all data points
async function deleteAllDataPoints() {
    try {
        // Use Mongoose to delete all documents from the collection
        const deleteResult = await MenuItemModel.deleteMany({});
        return deleteResult.deletedCount; // Return the number of documents deleted
    } catch (error) {
        // Handle any errors
        console.error('Error deleting data:', error);
        throw error; // Propagate the error to the caller
    }
}

module.exports = { deleteAllDataPoints };
