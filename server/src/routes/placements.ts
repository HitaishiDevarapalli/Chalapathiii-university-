import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// ============================================================================
// JSON Helper Functions (for SQLite stringified JSON fields)
// ============================================================================
function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function stringifyJsonField(value: any, fallback: string = "[]"): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(value);
    }
  }
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

function formatSuccessStory(story: any) {
  return {
    ...story,
    skills: parseJsonField<any[]>(story.skills, []),
    milestones: parseJsonField<Record<string, any>>(story.milestones, {}),
  };
}

// ============================================================================
// Top-level GET / - Overview of placements (students, recruiters, stories)
// ============================================================================
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [students, recruiters, rawStories] = await Promise.all([
      prisma.placedStudent.findMany({ orderBy: { id: "desc" } }),
      prisma.recruiter.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.successStory.findMany({ orderBy: { id: "desc" } }),
    ]);

    const stories = rawStories.map(formatSuccessStory);

    res.json({
      students,
      recruiters,
      stories,
    });
  } catch (error: any) {
    console.error("Error fetching placements overview:", error);
    res.status(500).json({ error: "Failed to fetch placements overview", details: error.message });
  }
});

// ============================================================================
// SUB-RESOURCE 1: /students (PlacedStudent)
// ============================================================================

// GET /students - List all placed students
router.get("/students", async (_req: Request, res: Response) => {
  try {
    const students = await prisma.placedStudent.findMany({
      orderBy: { id: "desc" },
    });
    res.json(students);
  } catch (error: any) {
    console.error("Error fetching placed students:", error);
    res.status(500).json({ error: "Failed to fetch placed students", details: error.message });
  }
});

// GET /students/:id - Get single placed student
router.get("/students/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const student = await prisma.placedStudent.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({ error: "Placed student not found" });
    }

    res.json(student);
  } catch (error: any) {
    console.error("Error fetching placed student:", error);
    res.status(500).json({ error: "Failed to fetch placed student", details: error.message });
  }
});

// POST /students - Create placed student
router.post("/students", async (req: Request, res: Response) => {
  try {
    const { name, branch, company, ctc, image } = req.body;

    if (!name || String(name).trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const student = await prisma.placedStudent.create({
      data: {
        name: String(name).trim(),
        branch: branch !== undefined ? String(branch) : "",
        company: company !== undefined ? String(company) : "",
        ctc: ctc !== undefined ? String(ctc) : "",
        image: image !== undefined ? String(image) : "",
      },
    });

    res.status(201).json(student);
  } catch (error: any) {
    console.error("Error creating placed student:", error);
    res.status(500).json({ error: "Failed to create placed student", details: error.message });
  }
});

// PUT /students/:id - Update placed student
router.put("/students/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const existing = await prisma.placedStudent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Placed student not found" });
    }

    const { name, branch, company, ctc, image } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = String(name).trim();
    if (branch !== undefined) data.branch = String(branch);
    if (company !== undefined) data.company = String(company);
    if (ctc !== undefined) data.ctc = String(ctc);
    if (image !== undefined) data.image = String(image);

    const updated = await prisma.placedStudent.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating placed student:", error);
    res.status(500).json({ error: "Failed to update placed student", details: error.message });
  }
});

// DELETE /students/:id - Delete placed student
router.delete("/students/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const existing = await prisma.placedStudent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Placed student not found" });
    }

    await prisma.placedStudent.delete({
      where: { id },
    });

    res.json({ message: "Placed student deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting placed student:", error);
    res.status(500).json({ error: "Failed to delete placed student", details: error.message });
  }
});

// ============================================================================
// SUB-RESOURCE 2: /recruiters (Recruiter)
// ============================================================================

// GET /recruiters - List all recruiters ordered by sortOrder
router.get("/recruiters", async (_req: Request, res: Response) => {
  try {
    const recruiters = await prisma.recruiter.findMany({
      orderBy: { sortOrder: "asc" },
    });
    res.json(recruiters);
  } catch (error: any) {
    console.error("Error fetching recruiters:", error);
    res.status(500).json({ error: "Failed to fetch recruiters", details: error.message });
  }
});

// GET /recruiters/:id - Get single recruiter
router.get("/recruiters/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recruiter ID" });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { id },
    });

    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    res.json(recruiter);
  } catch (error: any) {
    console.error("Error fetching recruiter:", error);
    res.status(500).json({ error: "Failed to fetch recruiter", details: error.message });
  }
});

// POST /recruiters - Create recruiter
router.post("/recruiters", async (req: Request, res: Response) => {
  try {
    const { name, logo, sortOrder } = req.body;

    if (!name || String(name).trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const recruiter = await prisma.recruiter.create({
      data: {
        name: String(name).trim(),
        logo: logo !== undefined ? String(logo) : "",
        sortOrder: sortOrder !== undefined ? parseInt(String(sortOrder), 10) || 0 : 0,
      },
    });

    res.status(201).json(recruiter);
  } catch (error: any) {
    console.error("Error creating recruiter:", error);
    res.status(500).json({ error: "Failed to create recruiter", details: error.message });
  }
});

// PUT /recruiters/:id - Update recruiter
router.put("/recruiters/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recruiter ID" });
    }

    const existing = await prisma.recruiter.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    const { name, logo, sortOrder } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = String(name).trim();
    if (logo !== undefined) data.logo = String(logo);
    if (sortOrder !== undefined) data.sortOrder = parseInt(String(sortOrder), 10) || 0;

    const updated = await prisma.recruiter.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating recruiter:", error);
    res.status(500).json({ error: "Failed to update recruiter", details: error.message });
  }
});

// DELETE /recruiters/:id - Delete recruiter
router.delete("/recruiters/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recruiter ID" });
    }

    const existing = await prisma.recruiter.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    await prisma.recruiter.delete({
      where: { id },
    });

    res.json({ message: "Recruiter deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting recruiter:", error);
    res.status(500).json({ error: "Failed to delete recruiter", details: error.message });
  }
});

// ============================================================================
// SUB-RESOURCE 3: /stories (SuccessStory)
// JSON fields: skills (JSON array), milestones (JSON object)
// ============================================================================

// GET /stories - List all success stories
router.get("/stories", async (_req: Request, res: Response) => {
  try {
    const stories = await prisma.successStory.findMany({
      orderBy: { id: "desc" },
    });

    res.json(stories.map(formatSuccessStory));
  } catch (error: any) {
    console.error("Error fetching success stories:", error);
    res.status(500).json({ error: "Failed to fetch success stories", details: error.message });
  }
});

// GET /stories/:id - Get single success story
router.get("/stories/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }

    const story = await prisma.successStory.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: "Success story not found" });
    }

    res.json(formatSuccessStory(story));
  } catch (error: any) {
    console.error("Error fetching success story:", error);
    res.status(500).json({ error: "Failed to fetch success story", details: error.message });
  }
});

// POST /stories - Create success story
router.post("/stories", async (req: Request, res: Response) => {
  try {
    const {
      studentName,
      studentImage,
      department,
      batch,
      companyName,
      companyLogo,
      packageOffered,
      description,
      skills,
      internshipExp,
      achievement,
      milestones,
    } = req.body;

    if (!studentName || String(studentName).trim() === "") {
      return res.status(400).json({ error: "Student name is required" });
    }

    const story = await prisma.successStory.create({
      data: {
        studentName: String(studentName).trim(),
        studentImage: studentImage !== undefined ? String(studentImage) : "",
        department: department !== undefined ? String(department) : "",
        batch: batch !== undefined ? String(batch) : "",
        companyName: companyName !== undefined ? String(companyName) : "",
        companyLogo: companyLogo !== undefined ? String(companyLogo) : "",
        packageOffered: packageOffered !== undefined ? String(packageOffered) : "",
        description: description !== undefined ? String(description) : "",
        skills: stringifyJsonField(skills, "[]"),
        internshipExp: internshipExp !== undefined ? String(internshipExp) : "",
        achievement: achievement !== undefined ? String(achievement) : "",
        milestones: stringifyJsonField(milestones, "{}"),
      },
    });

    res.status(201).json(formatSuccessStory(story));
  } catch (error: any) {
    console.error("Error creating success story:", error);
    res.status(500).json({ error: "Failed to create success story", details: error.message });
  }
});

// PUT /stories/:id - Update success story
router.put("/stories/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }

    const existing = await prisma.successStory.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Success story not found" });
    }

    const {
      studentName,
      studentImage,
      department,
      batch,
      companyName,
      companyLogo,
      packageOffered,
      description,
      skills,
      internshipExp,
      achievement,
      milestones,
    } = req.body;

    const data: any = {};
    if (studentName !== undefined) data.studentName = String(studentName).trim();
    if (studentImage !== undefined) data.studentImage = String(studentImage);
    if (department !== undefined) data.department = String(department);
    if (batch !== undefined) data.batch = String(batch);
    if (companyName !== undefined) data.companyName = String(companyName);
    if (companyLogo !== undefined) data.companyLogo = String(companyLogo);
    if (packageOffered !== undefined) data.packageOffered = String(packageOffered);
    if (description !== undefined) data.description = String(description);
    if (skills !== undefined) data.skills = stringifyJsonField(skills, "[]");
    if (internshipExp !== undefined) data.internshipExp = String(internshipExp);
    if (achievement !== undefined) data.achievement = String(achievement);
    if (milestones !== undefined) data.milestones = stringifyJsonField(milestones, "{}");

    const updated = await prisma.successStory.update({
      where: { id },
      data,
    });

    res.json(formatSuccessStory(updated));
  } catch (error: any) {
    console.error("Error updating success story:", error);
    res.status(500).json({ error: "Failed to update success story", details: error.message });
  }
});

// DELETE /stories/:id - Delete success story
router.delete("/stories/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }

    const existing = await prisma.successStory.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Success story not found" });
    }

    await prisma.successStory.delete({
      where: { id },
    });

    res.json({ message: "Success story deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting success story:", error);
    res.status(500).json({ error: "Failed to delete success story", details: error.message });
  }
});

export default router;
