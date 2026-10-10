import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// ============================================================================
// GET / - List all faculty members with optional filters & search
// Query params: ?school=X&department=X&directoryType=X(faculty|board|staff)&search=X
// Default directoryType: 'faculty'
// ============================================================================
router.get("/", async (req: Request, res: Response) => {
  try {
    const { school, department, directoryType, search } = req.query;

    const where: any = {};

    // Filter by directoryType (default to 'faculty' if not specified; allow 'all' to skip filter)
    if (directoryType !== undefined && directoryType !== "") {
      if (String(directoryType).toLowerCase() !== "all") {
        where.directoryType = String(directoryType);
      }
    } else {
      where.directoryType = "faculty";
    }

    if (school) {
      where.school = String(school);
    }

    if (department) {
      where.department = String(department);
    }

    if (search) {
      const q = String(search).trim();
      if (q) {
        where.OR = [
          { name: { contains: q } },
          { title: { contains: q } },
          { department: { contains: q } },
          { school: { contains: q } },
          { email: { contains: q } },
          { interests: { contains: q } },
          { idNo: { contains: q } },
        ];
      }
    }

    const members = await prisma.facultyMember.findMany({
      where,
      orderBy: [{ isHod: "desc" }, { name: "asc" }],
    });

    res.json(members);
  } catch (error: any) {
    console.error("Error fetching faculty members:", error);
    res.status(500).json({ error: "Failed to fetch faculty members", details: error.message });
  }
});

// ============================================================================
// POST /bulk - Bulk import faculty members (upsert by idNo)
// Body: FacultyMember[]
// ============================================================================
router.post("/bulk", async (req: Request, res: Response) => {
  try {
    const members = req.body;

    if (!Array.isArray(members)) {
      return res.status(400).json({ error: "Request body must be an array of faculty members" });
    }

    const results = [];

    for (const item of members) {
      if (!item || typeof item !== "object") continue;

      const memberData = {
        name: item.name ? String(item.name).trim() : "",
        title: item.title !== undefined ? String(item.title) : "",
        edu: item.edu !== undefined ? String(item.edu) : "",
        interests: item.interests !== undefined ? String(item.interests) : "",
        phone: item.phone !== undefined ? String(item.phone) : "",
        email: item.email !== undefined ? String(item.email) : "",
        avatar: item.avatar !== undefined ? String(item.avatar) : "",
        age: item.age !== undefined && item.age !== null ? String(item.age) : "",
        experience: item.experience !== undefined && item.experience !== null ? String(item.experience) : "",
        idNo: item.idNo !== undefined ? String(item.idNo).trim() : "",
        department: item.department !== undefined ? String(item.department) : "",
        school: item.school !== undefined ? String(item.school) : "",
        isHod: Boolean(item.isHod),
        directoryType: item.directoryType ? String(item.directoryType) : "faculty",
      };

      if (!memberData.name) {
        continue;
      }

      // Upsert logic: match by idNo if provided
      if (memberData.idNo) {
        const existingByIdNo = await prisma.facultyMember.findFirst({
          where: { idNo: memberData.idNo },
        });

        if (existingByIdNo) {
          const updated = await prisma.facultyMember.update({
            where: { id: existingByIdNo.id },
            data: memberData,
          });
          results.push(updated);
          continue;
        }
      }

      // If item has an id, check if existing by id
      if (item.id && !isNaN(Number(item.id))) {
        const existingById = await prisma.facultyMember.findUnique({
          where: { id: Number(item.id) },
        });

        if (existingById) {
          const updated = await prisma.facultyMember.update({
            where: { id: existingById.id },
            data: memberData,
          });
          results.push(updated);
          continue;
        }
      }

      // Otherwise create a new record
      const created = await prisma.facultyMember.create({
        data: memberData,
      });
      results.push(created);
    }

    res.status(200).json({
      message: `Successfully processed ${results.length} faculty members`,
      count: results.length,
      members: results,
    });
  } catch (error: any) {
    console.error("Error bulk importing faculty members:", error);
    res.status(500).json({ error: "Failed to bulk import faculty members", details: error.message });
  }
});

// ============================================================================
// GET /:id - Get single faculty member by ID
// ============================================================================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid faculty member ID" });
    }

    const member = await prisma.facultyMember.findUnique({
      where: { id },
    });

    if (!member) {
      return res.status(404).json({ error: "Faculty member not found" });
    }

    res.json(member);
  } catch (error: any) {
    console.error("Error fetching faculty member:", error);
    res.status(500).json({ error: "Failed to fetch faculty member", details: error.message });
  }
});

// ============================================================================
// POST / - Create a new faculty member
// ============================================================================
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      title,
      edu,
      interests,
      phone,
      email,
      avatar,
      age,
      experience,
      idNo,
      department,
      school,
      isHod,
      directoryType,
    } = req.body;

    if (!name || String(name).trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const member = await prisma.facultyMember.create({
      data: {
        name: String(name).trim(),
        title: title !== undefined ? String(title) : "",
        edu: edu !== undefined ? String(edu) : "",
        interests: interests !== undefined ? String(interests) : "",
        phone: phone !== undefined ? String(phone) : "",
        email: email !== undefined ? String(email) : "",
        avatar: avatar !== undefined ? String(avatar) : "",
        age: age !== undefined && age !== null ? String(age) : "",
        experience: experience !== undefined && experience !== null ? String(experience) : "",
        idNo: idNo !== undefined ? String(idNo).trim() : "",
        department: department !== undefined ? String(department) : "",
        school: school !== undefined ? String(school) : "",
        isHod: Boolean(isHod),
        directoryType: directoryType ? String(directoryType) : "faculty",
      },
    });

    res.status(201).json(member);
  } catch (error: any) {
    console.error("Error creating faculty member:", error);
    res.status(500).json({ error: "Failed to create faculty member", details: error.message });
  }
});

// ============================================================================
// PUT /:id - Update faculty member by ID
// ============================================================================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid faculty member ID" });
    }

    const existing = await prisma.facultyMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Faculty member not found" });
    }

    const {
      name,
      title,
      edu,
      interests,
      phone,
      email,
      avatar,
      age,
      experience,
      idNo,
      department,
      school,
      isHod,
      directoryType,
    } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = String(name).trim();
    if (title !== undefined) data.title = String(title);
    if (edu !== undefined) data.edu = String(edu);
    if (interests !== undefined) data.interests = String(interests);
    if (phone !== undefined) data.phone = String(phone);
    if (email !== undefined) data.email = String(email);
    if (avatar !== undefined) data.avatar = String(avatar);
    if (age !== undefined && age !== null) data.age = String(age);
    if (experience !== undefined && experience !== null) data.experience = String(experience);
    if (idNo !== undefined) data.idNo = String(idNo).trim();
    if (department !== undefined) data.department = String(department);
    if (school !== undefined) data.school = String(school);
    if (isHod !== undefined) data.isHod = Boolean(isHod);
    if (directoryType !== undefined) data.directoryType = String(directoryType);

    const updated = await prisma.facultyMember.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating faculty member:", error);
    res.status(500).json({ error: "Failed to update faculty member", details: error.message });
  }
});

// ============================================================================
// DELETE /:id - Delete faculty member by ID
// ============================================================================
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid faculty member ID" });
    }

    const existing = await prisma.facultyMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Faculty member not found" });
    }

    await prisma.facultyMember.delete({
      where: { id },
    });

    res.json({ message: "Faculty member deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting faculty member:", error);
    res.status(500).json({ error: "Failed to delete faculty member", details: error.message });
  }
});

export default router;
