import { useLocalStorage } from "@vueuse/core"

export function localStorageReset () {
    const keysToReset = ["courseId", "courseInstructor", "courseJoinCode", "courseName", "courseType", "courseURL", "module_visibility", "quiz_visibility"]
    for (key in keysToReset) {
        localStorage.removeItem(key)
    }
}