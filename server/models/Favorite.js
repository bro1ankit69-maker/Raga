import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    trackId: { type: String, required: true },
    title: String,
    artist: String,
    album: String,
    cover: String,
    audioUrl: String,
    genre: String,
    duration: Number,
  },
  { timestamps: true }
);
favoriteSchema.index({ userId: 1, trackId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
