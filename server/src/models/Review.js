import mongoose from 'mongoose';
import Property from './Property.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, property: 1 }, { unique: true });

const updatePropertyRating = async (propertyId) => {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { property: new mongoose.Types.ObjectId(propertyId) } },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length) {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  updatePropertyRating(this.property);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) updatePropertyRating(doc.property);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
