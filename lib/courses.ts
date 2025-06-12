import { getSupabaseBrowser } from "./supabase-browser"
import { getSupabaseServer } from "./supabase-server"

// Export the seed function
export { seedCourses } from "./seed-courses"

// Get all courses
export async function getCourses() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching courses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCourses:", error)
    return []
  }
}

// Get a single course by ID with all related data
export async function getCourseById(courseId: string) {
  try {
    const supabase = getSupabaseServer()

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(courseId)) {
      console.error("Invalid UUID format:", courseId)
      return null
    }

    // Get the course
    const { data: course, error: courseError } = await supabase.from("courses").select("*").eq("id", courseId).single()

    if (courseError) {
      console.error("Error fetching course:", courseError)
      return null
    }

    // Get modules for the course
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })

    if (modulesError) {
      console.error("Error fetching modules:", modulesError)
      return { ...course, modules: [] }
    }

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      (modules || []).map(async (module) => {
        const { data: lessons, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", module.id)
          .order("order_index", { ascending: true })

        if (lessonsError) {
          console.error("Error fetching lessons:", lessonsError)
          return { ...module, lessons: [] }
        }

        return { ...module, lessons: lessons || [] }
      }),
    )

    return { ...course, modules: modulesWithLessons }
  } catch (error) {
    console.error("Error in getCourseById:", error)
    return null
  }
}

// Get user progress for a course
export async function getUserProgress(userId: string, courseId: string) {
  try {
    const supabase = getSupabaseBrowser()
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)

    if (error) {
      console.error("Error fetching user progress:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserProgress:", error)
    return []
  }
}

// Update user progress
export async function updateUserProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  completed: boolean,
  points = 10,
) {
  try {
    const supabase = getSupabaseBrowser()

    // Check if progress entry exists
    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("lesson_id", lessonId)
      .single()

    if (existingProgress) {
      // Update existing progress
      const { error } = await supabase
        .from("user_progress")
        .update({ completed, points, updated_at: new Date().toISOString() })
        .eq("id", existingProgress.id)

      if (error) {
        console.error("Error updating progress:", error)
        return false
      }
    } else {
      // Create new progress entry
      const { error } = await supabase.from("user_progress").insert([
        {
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          completed,
          points,
        },
      ])

      if (error) {
        console.error("Error creating progress:", error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in updateUserProgress:", error)
    return false
  }
}

// Get user badges
export async function getUserBadges(userId: string) {
  try {
    const supabase = getSupabaseBrowser()
    const { data, error } = await supabase.from("user_badges").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user badges:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserBadges:", error)
    return []
  }
}
