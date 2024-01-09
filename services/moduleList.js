/*
Keep code within index.vue for the course pages identical for this code to work with (
  Index.vue is called, OnMounted loads in Modules and Quizzes that are stored in database
  Run a check against what is the expected stored and check against actual stored (for both)
  use settingsStore.js with this file and moduleList.js to determine which ones to add
  Add them in using settingsStore.js
  Update finally and push out to production
)

*/

export const moduleList = [
    {
      name: "pre-module",
      title: "Pre-Module: The Importance of Spatial Skills",
      description:
        "Learn about the importance of spatial skills for success in many careers.",
      visibility: true,
    },
    {
      name: "module-1",
      title: "Module 1: Combining Solids",
      description: "Learn how 3D shapes can be combined to form a single object.",
      visibility: false,
    },
    {
      name: "module-2",
      title: "Module 2: Surfaces and Solids of Revolution",
      description:
        "Learn how 2D shapes can be revolved around an axis to form a 3D Solid.",
      visibility: false,
    },
    {
      name: "module-3",
      title: "Module 3: Isometric Sketching and Coded Plans",
      description: "Learn about isometric sketching.",
      visibility: false,
    },
    {
      name: "module-4",
      title: "Module 4: Flat Patterns",
      description: "Learn about flat patterns.",
      visibility: false,
    },
    {
      name: "module-5",
      title: "Module 5: Rotation of Objects About a Single Axis",
      description: "Learn how to rotate objects about one axis.",
      visibility: false,
    },
    {
      name: "module-6",
      title: "Module 6: Reflections and Symmetry",
      description: "Learn about object reflection and symmetry.",
      visibility: false,
    },
    {
      name: "module-7",
      title: "Module 7: Cutting Planes and Cross-Sections",
      description:
        "Learn how 3D shapes can be sliced and how to determine shapes at cross-sections.",
      visibility: false,
    },
    {
      name: "module-8",
      title: "Module 8: Rotation of Objects About Two or More Axes",
      description: "Learn how to rotate objects about two or more axes.",
      visibility: false,
    },
    {
      name: "module-9",
      title: "Module 9: Orthographic Projection",
      description:
        "Learn how to create a set of orthographic drawings from a single object.",
      visibility: false,
    },
    {
      name: "module-10",
      title: "Module 10: Inclined and Curved Surfaces",
      description:
        "Learn how to create a set of orthographic drawings from an object that includes inclined or curved surfaces.",
      visibility: false,
    },
  ];