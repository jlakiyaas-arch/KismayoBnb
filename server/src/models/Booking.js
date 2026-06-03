import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });

bookingSchema.pre('validate', function (next) {
  if (this.checkOut && this.checkIn && this.checkOut <= this.checkIn) {
    next(new Error('checkOut must be after checkIn'));
  } else {
    next();
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
