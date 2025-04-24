import  TryCatch  from "../middleware/TryCatch";
import { Courses } from "../models/Courses";
import { Lecture } from "../models/Lecture";
import { User } from "../models/User";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration (should ideally be in a separate config file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url: string | undefined): string | null => {
  if (!url) return null;
  
  try {
    // Handle different Cloudinary URL formats
    const parts = url.split('/');
    const withExtension = parts.pop() || '';
    return withExtension.split('.')[0];
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

export const createCourse = TryCatch(async (req: any, res: any) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path, // Cloudinary URL
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req: any, res: any) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "No Course with this id",
    });
  }

  const { title, description } = req.body;
  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path, // Cloudinary URL
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req: any, res: any) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  // Delete from Cloudinary
  if (lecture.video) {
    const publicId = extractPublicId(lecture.video);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video'
      });
    }
  }

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req: any, res: any) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Delete all lectures and their videos
  const lectures = await Lecture.find({ course: course._id });
  
  await Promise.all(
    lectures.map(async (lecture: any) => {
      if (lecture.video) {
        const publicId = extractPublicId(lecture.video);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video'
          });
        }
      }
    })
  );


  if (course.image) {
    const publicId = extractPublicId(course.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  
  await Lecture.deleteMany({ course: req.params.id });

  await course.deleteOne();
 

  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});

export const getAllStats = TryCatch(async (req: any, res: any) => {
  const totalCoures = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req: any, res: any) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req: any, res: any) => {
  if (req.user.mainrole !== "superadmin") {
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  if (user.role === "user") {
    user.role = "admin";
    await user.save();
    return res.status(200).json({
      message: "Role updated to admin",
    });
  }
  
  if (user.role === "admin") {
    user.role = "user";
    await user.save();
    return res.status(200).json({
      message: "Role updated to user",
    });
  }
});