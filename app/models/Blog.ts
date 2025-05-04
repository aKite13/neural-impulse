import mongoose, { Schema, model, Model } from "mongoose";

export interface IImage {
  id: string;
  url: string;
}

// Упрощаем IComment, user теперь просто ID
export interface IComment {
  _id?: string;
  user: string | mongoose.Types.ObjectId; // ID пользователя, заполняется через populate
  text: string;
  date: Date;
}

export interface IBlog {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  excerpt: string;
  quote: string;
  image?: IImage;
  category: "AI and life" | "AI and the future" | "AI in action" | "AI and the brain" | "AI and algorithms";
  authorId: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogClient {
  _id: string;
  title: string;
  description: string;
  excerpt: string;
  quote: string;
  image?: IImage;
  category: "AI and life" | "AI and the future" | "AI in action" | "AI and the brain" | "AI and algorithms";
  authorId: {
    _id: string;
    name: string;
    avatar?: { url: string };
    designation?: string;
  };
  likes: string[];
  comments: {
    _id?: string;
    user: {
      _id: string;
      name: string;
      avatar?: { url: string };
    };
    text: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    excerpt: { type: String, required: [true, "Excerpt is required"] },
    quote: { type: String, required: [true, "Quote is required"] },
    image: { type: { id: String, url: String }, required: false },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["AI and life", "AI and the future", "AI in action", "AI and the brain", "AI and algorithms"],
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Blog: Model<IBlog> = mongoose.models.Blog || model<IBlog>("Blog", BlogSchema);
export default Blog;