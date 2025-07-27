const { Schema, model } = require("../connection");

const mySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the project.'],
        trim: true, //white space remove 
        maxlength: [150, 'Title cannot be more than 150 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the project.'],
        trim: true,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    abstract: {
        // A short summary, maybe for cards or quick views
        type: String,
        trim: true,
        maxlength: [300, 'Abstract cannot be more than 300 characters'],
    },
    contributors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user', // Reference to your User model
            required: [true, 'Please specify at least one contributor.'],
        },
    ],

    technologiesUsed: [
        {
            type: String,
            trim: true,
        },
    ],
    tags: [
        // For categorization and searching (e.g., 'Web Dev', 'AI', 'IoT')
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Creator is required.'],
    },


    sourceCodeUrl: {
        // Link to GitHub, GitLab, etc.
        type: String,
        trim: true,
        // Basic URL validation can be added here if needed
    },
    thumbnailUrl: {
        // URL for a project image/thumbnail
        type: String,
        trim: true,
        // Consider using a default image URL if not provided
        default: '/images/default-project-thumbnail.png', // Example path
    },
    // You might want more images/screenshots
    galleryImageUrls: [
      {
        type: String,
        trim: true,
      }
    ],
    categories: [
        {
            type: String,
            trim: true,
            required: true
        }
    ],
    academicYear: {
        // e.g., '2024-2025'
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Archived'],
        default: 'Ongoing',
    },
    // If you want to store *who* liked it:
    // likedBy: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    //   }
    // ],
    // Add any other fields relevant to your showcase
    // e.g., awardsWon: [String], presentationDate: Date, etc.




}, { timestamps: true })

module.exports = model('project', mySchema);