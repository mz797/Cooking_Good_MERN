import mongoose from "mongoose";

const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Newsletter", newsletterSchema);
